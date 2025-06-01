import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId, title, description, imageUrl, scheduledDate, boardId } = await req.json()

    if (!postId || !title || !description || !imageUrl || !scheduledDate || !boardId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Store the scheduled post in the database
    const result = await db.collection("pins").insertOne({
      userId: session.user.id,
      postId,
      title,
      description,
      imageUrl,
      boardId,
      status: "scheduled",
      scheduledDate: new Date(scheduledDate),
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Post scheduled successfully",
      scheduledId: result.insertedId,
    })
  } catch (error) {
    console.error("Error scheduling post:", error)
    return NextResponse.json({ error: "Failed to schedule post" }, { status: 500 })
  }
}
