import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db()
    const postsCollection = db.collection("posts")

    const now = new Date()
    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const recentPosts = await postsCollection
      .find({ createdAt: { $gte: since } })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ posts: recentPosts })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
