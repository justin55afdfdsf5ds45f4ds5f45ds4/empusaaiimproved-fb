import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import { INVITATION_EXPIRY_DAYS } from "@/models/invitation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Generate a new invitation token
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you'd check if the user has admin privileges
    // For now, we'll assume all authenticated users can create invitations

    const { email } = await req.json()

    // Generate a unique token
    const token = uuidv4()

    // Calculate expiration date (7 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS)

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Create invitation record
    await db.collection("invitations").insertOne({
      token,
      email: email || null,
      createdAt: new Date(),
      expiresAt,
      used: false,
      createdBy: session.user.email,
    })

    return NextResponse.json({
      success: true,
      token,
      inviteLink: `${process.env.NEXTAUTH_URL}/register?token=${token}`,
    })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
  }
}

// Get all invitations (for admin panel)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Get all invitations, sorted by creation date (newest first)
    const invitations = await db.collection("invitations").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ invitations })
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 })
  }
}
