import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get total posts count
    const totalPosts = await db.collection("pins").countDocuments({
      userId: session.user.id,
    })

    // Get scheduled posts count
    const scheduledPosts = await db.collection("pins").countDocuments({
      userId: session.user.id,
      status: "scheduled",
    })

    // Get Pinterest engagement (total saves + comments)
    const pins = await db.collection("pins")
      .find({ userId: session.user.id })
      .project({ pinterestId: 1 })
      .toArray()

    let totalEngagement = 0
    if (pins.length > 0) {
      // In a real app, you would fetch engagement metrics from Pinterest API
      // For now, we'll return a mock value
      totalEngagement = pins.length * 10 // Mock engagement
    }

    return NextResponse.json({
      totalPosts,
      scheduledPosts,
      totalEngagement,
    })
  } catch (error) {
    console.error("Dashboard metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 })
  }
}
#kjbjb
