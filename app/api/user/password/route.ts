import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export async function PUT(req: Request) {
  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json()

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New password and confirm password do not match" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if user exists in Supabase Auth
    const { data: authUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(session.user.email)
    
    if (getUserError || !authUser.user) {
      return NextResponse.json({ 
        error: "Cannot change password for OAuth accounts. Please use your OAuth provider to manage your password." 
      }, { status: 400 })
    }

    // Update password using Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.user.id,
      { password: newPassword }
    )

    if (updateError) {
      console.error("Error updating password:", updateError)
      
      if (updateError.message.includes("OAuth")) {
        return NextResponse.json({ 
          error: "Cannot change password for social login accounts. Please use your social login provider to manage your password." 
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: "Failed to update password. Please try again." 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: "Password updated successfully" 
    })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ 
      error: "An unexpected error occurred. Please try again." 
    }, { status: 500 })
  }
}
