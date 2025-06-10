import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get user's posts count
    const totalPosts = await db.collection("pins").countDocuments({
      userId: new ObjectId(session.user.id),
    })

    // Get scheduled posts count
    const scheduledPosts = await db.collection("scheduled_posts").countDocuments({
      userId: new ObjectId(session.user.id),
      isPublished:false,
    })

    // For now, return 0 for engagement as we don't have Pinterest analytics yet
    const totalEngagement = 0

    return NextResponse.json({
      totalPosts,
      scheduledPosts,
      totalEngagement,
    })
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
