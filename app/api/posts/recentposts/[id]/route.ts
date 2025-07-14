import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { deleteImage } from "@/lib/cloudinary1"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { link } = body
    if (!link) return NextResponse.json({ error: "Missing link" }, { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const id = params.id
    const filter: any = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id, userId: session.user.id }
    await db.collection("posts").updateOne(filter, { $set: { defaultLink: link } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Update link error", e)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const client = await clientPromise
    const db = client.db()
    const id = params.id
    const filter: any = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id, userId: session.user.id }

    const post = await db.collection("posts").findOne(filter)
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (post.cloudinaryPublicId) {
      try { await deleteImage(post.cloudinaryPublicId) } catch (e) { console.error("Cloudinary delete fail", e) }
    }

    await db.collection("posts").deleteOne(filter)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Delete post error", e)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
