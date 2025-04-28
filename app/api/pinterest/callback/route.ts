import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      // Instead of returning JSON, redirect to login page
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const storedState = request.cookies.get("pinterest_auth_state")?.value
    const error = searchParams.get("error")

    // Check for error parameter
    if (error) {
      console.error("Pinterest OAuth error:", error)
      // Redirect to dashboard with error
      return NextResponse.redirect(new URL("/dashboard?auth=failed", request.url))
    }

    // Verify state to prevent CSRF attacks
    if (!state || !storedState || state !== storedState) {
      console.error("Invalid state parameter")
      // Redirect to dashboard with error
      return NextResponse.redirect(new URL("/dashboard?auth=invalid_state", request.url))
    }

    if (!code) {
      console.error("Authorization code missing")
      // Redirect to dashboard with error
      return NextResponse.redirect(new URL("/dashboard?auth=no_code", request.url))
    }

    const appId = process.env.PINTEREST_APP_ID
    const appSecret = process.env.PINTEREST_APP_SECRET
    const redirectUri = process.env.PINTEREST_REDIRECT_URI

    if (!appId || !appSecret || !redirectUri) {
      console.error("Pinterest configuration missing")
      // Redirect to dashboard with error
      return NextResponse.redirect(new URL("/dashboard?auth=config_missing", request.url))
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
      // Redirect to dashboard with error
      return NextResponse.redirect(new URL("/dashboard?auth=token_error", request.url))
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData

    // Create a response that redirects to the dashboard
    const response = NextResponse.redirect(new URL("/dashboard?auth=success", request.url))

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
    // Redirect to dashboard with error
    return NextResponse.redirect(new URL("/dashboard?auth=server_error", request.url))
  }
}
