import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { refreshPinterestToken } from "@/lib/pinterest"
import { uploadToCloudinary } from "../../cloudinary/upload"
import { incrementDailyLimit } from "@/lib/daily-limits"

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const { boardId, imageUrl, title, description, scheduledTime } = await req.json()

    // Validate required fields
    if (!boardId || !imageUrl || !title || !scheduledTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check daily limits
    const incrementResult = await incrementDailyLimit(session.user.id, "postsScheduled", 1);
    if (!incrementResult.success) {
      const client = await clientPromise;
      const db = client.db();
      const userDoc = await db.collection("users").findOne({ id: session.user.id });
      const isPremium = userDoc?.premiumUntil && new Date(userDoc.premiumUntil) > new Date();
      const limitType = isPremium?"Premium":"Free";
      const maxPosts = isPremium?100:5;
      const nextReset = incrementResult.nextResetTime.toLocaleTimeString("en-US",{hour:"numeric",minute:"numeric",hour12:true});
      console.log("[ScheduleRoute] Daily limit reached",{user:session.user.email,isPremium,remaining:incrementResult.remaining});
      return NextResponse.json(
        { details:{
            title:`${limitType} Plan Limit`,
            description:`You've reached today's schedule limit of ${maxPosts} posts. Resets at ${nextReset}.`,
            action:isPremium?"Upgrade to Enterprise →":"Upgrade to Premium →"
        } },
        { status: 403 }
      );
    }

    // Get the user's Pinterest tokens from the database
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 })
    }

    // Upload to Cloudinary
    const cloud_url = await uploadToCloudinary(imageUrl)
    console.log('Scheduled Image Uploaded to:', cloud_url)

    // Store scheduled post in DB
    await db.collection("scheduled_posts").insertOne({
      userId: user._id,
      boardId,
      title,
      description: description || "",
      cloudinaryUrl: cloud_url,
      scheduledTime: new Date(scheduledTime),
      isPublished: false,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Post scheduled successfully",
    })
  } catch (error) {
    console.error("Schedule post error:", error)
    return NextResponse.json({ error: "Failed to schedule post" }, { status: 500 })
  }
}
