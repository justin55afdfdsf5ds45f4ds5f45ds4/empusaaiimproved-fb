import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Validate an invitation token
export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Find the invitation
    const invitation = await db.collection("invitations").findOne({ token })

    if (!invitation) {
      return NextResponse.json({ valid: false, error: "Invalid invitation token" })
    }

    if (invitation.used) {
      return NextResponse.json({ valid: false, error: "This invitation has already been used" })
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return NextResponse.json({ valid: false, error: "This invitation has expired" })
    }

    return NextResponse.json({ valid: true, email: invitation.email || null })
  } catch (error) {
    console.error("Error validating invitation:", error)
    return NextResponse.json({ valid: false, error: "Failed to validate invitation" }, { status: 500 })
  }
}
