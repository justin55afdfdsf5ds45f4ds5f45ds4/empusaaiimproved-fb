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

    const clientDb = await clientPromise;
    const mongo = clientDb.db();
    const userDoc = await mongo.collection("users").findOne({ id: session.user.id });
    const isPremium = userDoc?.premiumUntil && new Date(userDoc.premiumUntil) > new Date();

    // Check daily limits
    const incrementResult = await incrementDailyLimit(session.user.id, "postsScheduled", posts.length);
    if (!incrementResult.success) {
      const limitType = isPremium ? "Premium" : "Free";
      const maxPosts = isPremium ? 100 : 5;
      const nextReset = incrementResult.nextResetTime.toLocaleTimeString("en-US", {hour:"numeric",minute:"numeric",hour12:true});
      return NextResponse.json(
        { details:{
            title: `${limitType} Plan Limit`,
            description:`You've reached today's schedule limit of ${maxPosts} posts. Resets at ${nextReset}.`,
            action: isPremium?"Upgrade to Enterprise →":"Upgrade to Premium →"
        } },
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
