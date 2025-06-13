import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const { name, email, password, token } = await req.json()

    // Validate fields
    if (!name || !email || !password || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Validate the invitation token
    const invitation = await db.collection("invitations").findOne({ token })

    if (!invitation) {
      return NextResponse.json({ error: "Invalid invitation token" }, { status: 400 })
    }

    if (invitation.used) {
      return NextResponse.json({ error: "This invitation has already been used" }, { status: 400 })
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return NextResponse.json({ error: "This invitation has expired" }, { status: 400 })
    }

    // Check if user already exists
    const users = db.collection("users")
    const existing = await users.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      role: "user", // Default role
    })

    // Mark invitation as used
    await db.collection("invitations").updateOne(
      { token },
      {
        $set: {
          used: true,
          usedAt: new Date(),
          usedBy: email,
        },
      },
    )

    // Return success without sensitive data
    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.insertedId.toString(),
          name,
          email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
