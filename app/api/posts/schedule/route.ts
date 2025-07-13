import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { incrementDailyLimit } from "@/lib/daily-limits"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { boardId, posts } = body;

    // Validate required fields
    if (!boardId || !posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check daily limits
    const incrementResult = await incrementDailyLimit(session.user.id, "postsScheduled", posts.length);
    if (!incrementResult.success) {
      return NextResponse.json(
        { error: "Daily scheduling limit reached" },
        { status: 403 }
      );
    }

    const client = await clientPromise
    const db = client.db()

    // Store each scheduled post in the database
    const scheduledPosts = posts.map(post => ({
      userId: session.user.id,
      postId: post.id,
      title: post.title,
      description: post.description || "",
      imageUrl: post.imageUrl,
      boardId,
      status: "scheduled",
      scheduledDate: new Date(post.scheduledTime),
      link: post.link,
      createdAt: new Date(),
    }));

    const result = await db.collection("pins").insertMany(scheduledPosts);

    return NextResponse.json({
      success: true,
      message: "Posts scheduled successfully",
      scheduledIds: result.insertedIds,
    })
  } catch (error) {
    console.error("Error scheduling post:", error)
    return NextResponse.json({ error: "Failed to schedule post" }, { status: 500 })
  }
}
