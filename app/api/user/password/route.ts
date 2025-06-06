import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json()

    if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "New password and confirm password do not match" }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()
    const user = await db.collection("users").findOne({ email: session.user.email })
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordCorrect) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await db.collection("users").updateOne(
        { email: session.user.email },
        { $set: { password: hashedNewPassword } }
    )


    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
