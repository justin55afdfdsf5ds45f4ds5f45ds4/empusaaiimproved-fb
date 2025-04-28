import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appId = process.env.PINTEREST_APP_ID
    const redirectUri = process.env.PINTEREST_REDIRECT_URI

    if (!appId || !redirectUri) {
      return NextResponse.json({ error: "Pinterest configuration missing" }, { status: 500 })
    }

    // Generate a random state to prevent CSRF attacks
    const state = Math.random().toString(36).substring(2, 15)

    // Construct the Pinterest OAuth URL
    // Make sure we're using the correct OAuth endpoint
    const url = `https://www.pinterest.com/oauth/?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=boards:read,pins:read,pins:write&state=${state}`

    // Set a cookie with the state
    const response = NextResponse.json({ url })
    response.cookies.set("pinterest_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error generating Pinterest auth URL:", error)
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 })
  }
}
