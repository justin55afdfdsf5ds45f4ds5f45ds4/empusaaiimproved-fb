import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const premiumUntil = new Date();
    premiumUntil.setMonth(premiumUntil.getMonth() + 1);

    // Check if user already exists
    const { data: existing, error: checkErr } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (checkErr && checkErr.code !== "PGRST116" && checkErr.code !== "PGRST123") {
      console.error("Error checking existing user:", checkErr)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existing) {
      // Update password to new one so user can use latest code
      const { error: updErr } = await supabaseAdmin
        .from("users")
        .update({ password: await bcrypt.hash(password, 10), premiumuntil: premiumUntil.toISOString() })
        .eq("id", existing.id)

      if (updErr) {
        console.error("Error updating password:", updErr)
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
      }

      return NextResponse.json({ success: true, user: existing }, { status: 200 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          email_verified: null,
          image: null,
          created_at: new Date().toISOString(),
          premiumuntil: premiumUntil.toISOString(),
        },
      ])
      .select("id")
      .single()

    if (insertError) {
      console.error("Error inserting user:", insertError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name,
          email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
