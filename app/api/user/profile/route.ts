import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from Supabase
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, image, premiumuntil")
      .eq("email", session.user.email)
      .single()
    
    if (error || !user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    // Return user profile data
    return Response.json({
      name: user.name,
      email: user.email,
      image: user.image,
      premiumUntil: user.premiumuntil,
      provider: null // Will be handled by auth system
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const contentType = request.headers.get('content-type')
    console.log("Profile update request content-type:", contentType)
    
    let requestData
    try {
      requestData = await request.json()
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      return Response.json({ error: "Invalid JSON data" }, { status: 400 })
    }
    
    const { name, email, image } = requestData

    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get user from Supabase Auth
    const { data: authUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(session.user.email)
    
    if (getUserError || !authUser.user) {
      return Response.json({ error: "User not found in authentication system" }, { status: 404 })
    }

    // Update user using Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.user.id,
      {
        email: email,
        user_metadata: { 
          name: name,
          image: image 
        }
      }
    )

    if (updateError) {
      console.error("Supabase Auth update error:", updateError)
      
      if (updateError.message.includes("email")) {
        return Response.json({ 
          error: "Email address is already in use or invalid. Please try a different email." 
        }, { status: 400 })
      }
      
      return Response.json({ 
        error: "Failed to update profile. Please try again." 
      }, { status: 500 })
    }

    const updateData: { name: string; email: string; image?: string } = { name, email }
    if (image) {
      updateData.image = image
    }

    const { error: tableError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("email", session.user.email)

    if (tableError) {
      console.warn("Warning: Failed to update users table:", tableError)
    }

    return Response.json({ 
      message: "Profile updated successfully",
      success: true 
    }, { status: 200 })
  } catch (error) {
    console.error("Error updating profile:", error)
    return Response.json({ 
      error: "An unexpected error occurred. Please try again." 
    }, { status: 500 })
  }
}
