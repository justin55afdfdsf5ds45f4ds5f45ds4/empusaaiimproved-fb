import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"

export async function POST() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove the Pinterest connection from the database
    const client = await clientPromise
    const db = client.db()

    await db.collection("users").updateOne({ email: session.user.email }, { $unset: { pinterest: "" } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Pinterest disconnect error:", error)
    return NextResponse.json({ error: "Failed to disconnect Pinterest account" }, { status: 500 })
  }
}
