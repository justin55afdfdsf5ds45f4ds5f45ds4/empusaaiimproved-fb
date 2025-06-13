import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Adjust path if needed
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, email, image } = await request.json() // Add image here

    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    const updateData: { name: string; email: string; image?: string } = { name, email }
    if (image) {
      // If image is provided, include it in update
      updateData.image = image
    }

    const result = await usersCollection.updateOne({ _id: new ObjectId(session.user.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating profile:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
