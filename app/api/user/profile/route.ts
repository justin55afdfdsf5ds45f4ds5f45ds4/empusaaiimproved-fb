import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"

export async function PUT(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const { name, email } = await req.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update the user in the database
    const client = await clientPromise
    const db = client.db()

    // Check if the email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await db.collection("users").findOne({ email })
      if (existingUser) {
        return NextResponse.json({ error: "Email is already taken" }, { status: 409 })
      }
    }

    // Update the user
    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          email,
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
