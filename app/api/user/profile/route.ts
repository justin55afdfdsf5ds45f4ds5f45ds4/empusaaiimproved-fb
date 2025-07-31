import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

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

    // Prepare update data
    const updateData: { name: string; email: string; image?: string } = { name, email }
    if (image) {
      updateData.image = image
    }

    // Update user in Supabase
    const { error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("email", session.user.email)

    if (error) {
      console.error("Supabase update error:", error)
      return Response.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return Response.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating profile:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
