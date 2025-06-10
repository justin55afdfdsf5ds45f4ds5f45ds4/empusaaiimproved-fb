import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { uploadToCloudinary } from "../../cloudinary/upload";
import { createPinterestPin, refreshPinterestToken } from "@/lib/pinterest";

export async function GET() {
  const now = new Date();
  const client = await clientPromise;
  const db = client.db();

  const posts = await db.collection("scheduled_posts").find({
    isPublished: false,
    scheduledTime: { $lte: now }
  }).toArray();

  const results: any[] = [];

  for (const post of posts) {
    try {
      const user = await db.collection("users").findOne({ _id: post.userId });

      if (!user || !user.pinterest || !user.pinterest.accessToken) {
        return NextResponse.json({ error: "Pinterest account not connected" }, { status: 400 })
      }
  
      // Check if the token is expired and refresh if needed
      let accessToken = user.pinterest.accessToken
      if (user.pinterest.expiresAt && new Date(user.pinterest.expiresAt) < new Date()) {
        const refreshResult = await refreshPinterestToken(user.pinterest.refreshToken)
        if (refreshResult.success) {
          accessToken = refreshResult.accessToken
        } else {
          return NextResponse.json({ error: "Failed to refresh Pinterest token" }, { status: 401 })
        }
      }

      const pinResponse = await fetch("https://api.pinterest.com/v5/pins", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board_id: post.boardId,
          media_source: {
            source_type: "image_url",
            url: post.cloudinaryUrl,
          },
          title: post.title,
          description: post.description || "",
          alt_text: post.title,
        }),
      })

      if (!pinResponse.ok) {
        const errorText = await pinResponse.text()
        console.error("Pinterest pin creation error:", errorText)
  
        // If unauthorized, the token might be invalid
        if (pinResponse.status === 401) {
          return NextResponse.json({ error: "Pinterest authorization expired" }, { status: 401 })
        }
  
        return NextResponse.json({ error: "Failed to create Pinterest pin" }, { status: pinResponse.status })
      }

      const pinData = await pinResponse.json()

    // Store the pin in the database
    await db.collection("pins").insertOne({
      userId: user._id,
      pinterestId: pinData.id,
      boardId: post.boardId,
      title: post.title,
      description: post.description || "",
      imageUrl: post.cloudinaryUrl,
      createdAt: new Date(),
    })

      if (pinData?.id) {
        await db.collection("scheduled_posts").updateOne(
          { _id: post._id },
          {
            $set: {
              isPublished: true,
              publishedAt: new Date(),
              pinterestId: pinData.id,
            }
          }
        );
        results.push({ id: post._id, success: true });
      }
    } catch (err) {
      console.error("Post publish error:", err);
      results.push({ id: post._id, success: false });
    }
  }

  return NextResponse.json({ message: "Checked scheduled posts", results });
}
