import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15)

    // Store state in a cookie for verification in the callback
    const response = NextResponse.json({
      url: `https://www.pinterest.com/oauth/?client_id=${process.env.AUTH_PINTEREST_ID}&redirect_uri=${encodeURIComponent(process.env.PINTEREST_REDIRECT_URI || "")}&response_type=code&scope=boards:read,pins:read,pins:write&state=${state}`,
    })

    // Set cookie with state for 10 minutes
    response.cookies.set("pinterest_oauth_state", state, {
      maxAge: 600,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Pinterest connect error:", error)
    return NextResponse.json({ error: "Failed to initiate Pinterest connection" }, { status: 500 })
  }
}
