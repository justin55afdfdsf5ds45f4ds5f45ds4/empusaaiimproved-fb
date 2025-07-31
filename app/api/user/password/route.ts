import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json()

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New password and confirm password do not match" }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from Supabase
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, password")
      .eq("email", session.user.email)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has a password (OAuth users may not have one)
    if (!user.password) {
      return NextResponse.json({ 
        error: "Cannot change password for OAuth accounts. Please use your OAuth provider to manage your password." 
      }, { status: 400 })
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update password in Supabase
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password: hashedNewPassword })
      .eq("email", session.user.email)

    if (updateError) {
      console.error("Error updating password:", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
