import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { from, to } = body

    if (!from || !to) {
      return NextResponse.json({ error: "Both 'from' and 'to' dates are required." }, { status: 400 })
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)

    const client = await clientPromise
    const db = client.db()

    const userId = new ObjectId(session.user.id)

    // Count posts created within the date range
    const totalPosts = await db.collection("posts").countDocuments({
      userId,
      createdAt: { $gte: fromDate, $lte: toDate },
    })

    // Count scheduled posts within the date range
    const scheduledPosts = await db.collection("scheduled_posts").countDocuments({
      userId,
      isPublished: false,
      createdAt: { $gte: fromDate, $lte: toDate },
    })

    // Placeholder for engagement (you can update later if available)
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
