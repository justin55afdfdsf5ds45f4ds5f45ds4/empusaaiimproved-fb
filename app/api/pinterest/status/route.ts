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

    // Get the user's Pinterest connection from the database
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if the user has a Pinterest connection
    if (!user.pinterest || !user.pinterest.accessToken) {
      return NextResponse.json({ connected: false })
    }

    return NextResponse.json({
      connected: true,
      profile: user.pinterest.profile || null,
    })
  } catch (error) {
    console.error("Pinterest status error:", error)
    return NextResponse.json({ error: "Failed to check Pinterest status" }, { status: 500 })
  }
}
