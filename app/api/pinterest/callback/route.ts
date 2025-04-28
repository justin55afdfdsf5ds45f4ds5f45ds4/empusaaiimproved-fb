import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const storedState = request.cookies.get("pinterest_auth_state")?.value

    // Verify state to prevent CSRF attacks
    if (!state || !storedState || state !== storedState) {
      return NextResponse.json({ error: "Invalid state" }, { status: 400 })
    }

    if (!code) {
      return NextResponse.json({ error: "Authorization code missing" }, { status: 400 })
    }

    const appId = process.env.PINTEREST_APP_ID
    const appSecret = process.env.PINTEREST_APP_SECRET
    const redirectUri = process.env.PINTEREST_REDIRECT_URI

    if (!appId || !appSecret || !redirectUri) {
      return NextResponse.json({ error: "Pinterest configuration missing" }, { status: 500 })
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: appId,
        client_secret: appSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Pinterest token error:", errorData)
      return NextResponse.json({ error: "Failed to get access token" }, { status: 500 })
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData

    // In a real app, you would store these tokens in a database
    // For demo purposes, we'll just use cookies
    const response = NextResponse.json({ success: true })

    // Set cookies with the tokens
    response.cookies.set("pinterest_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
    })

    if (refresh_token) {
      response.cookies.set("pinterest_refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    }

    // Clear the state cookie
    response.cookies.set("pinterest_auth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error handling Pinterest callback:", error)
    return NextResponse.json({ error: "Failed to process callback" }, { status: 500 })
  }
}
