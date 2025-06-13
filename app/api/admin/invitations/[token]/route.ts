import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Delete an invitation
export async function DELETE(req: Request, { params }: { params: { token: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { token } = params

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Delete the invitation
    const result = await db.collection("invitations").deleteOne({ token })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting invitation:", error)
    return NextResponse.json({ error: "Failed to delete invitation" }, { status: 500 })
  }
}
