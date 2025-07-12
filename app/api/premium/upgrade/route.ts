import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const premiumUntil = new Date()
  premiumUntil.setMonth(premiumUntil.getMonth() + 1)

  const { error } = await supabaseAdmin
    .from("users")
    .update({ premiumuntil: premiumUntil.toISOString() })
    .eq("id", session.user.id)

  if (error) {
    console.error("Error updating premiumUntil:", error)
    return NextResponse.json({ error: "Failed to upgrade" }, { status: 500 })
  }

  return NextResponse.json({ success: true, premiumUntil })
}
