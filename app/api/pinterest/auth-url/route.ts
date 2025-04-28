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
      console.error("Pinterest configuration missing:", { appId: !!appId, redirectUri: !!redirectUri })
      return NextResponse.json({ error: "Pinterest configuration missing" }, { status: 500 })
    }

    // Generate a random state to prevent CSRF attacks
    const state = Math.random().toString(36).substring(2, 15)

    // Construct the Pinterest OAuth URL - using the v5 API endpoint
    const url = new URL("https://www.pinterest.com/oauth/")
    url.searchParams.append("client_id", appId)
    url.searchParams.append("redirect_uri", redirectUri)
    url.searchParams.append("response_type", "code")
    url.searchParams.append("scope", "boards:read,pins:read,pins:write")
    url.searchParams.append("state", state)

    // Set a cookie with the state
    const response = NextResponse.json({ url: url.toString() })
    response.cookies.set("pinterest_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Error generating Pinterest auth URL:", error)
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 })
  }
}
