import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      console.error("No session found in callback")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const storedState = request.cookies.get("pinterest_auth_state")?.value
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    console.log("Pinterest callback received:", {
      hasCode: !!code,
      hasState: !!state,
      hasStoredState: !!storedState,
      error,
      errorDescription,
    })

    // Check for error parameter
    if (error) {
      console.error("Pinterest OAuth error:", error, errorDescription)
      return NextResponse.redirect(new URL(`/dashboard?auth=failed&error=${encodeURIComponent(error)}`, request.url))
    }

    // Verify state to prevent CSRF attacks
    if (!state || !storedState || state !== storedState) {
      console.error("Invalid state parameter", { state, storedState })
      return NextResponse.redirect(new URL("/dashboard?auth=invalid_state", request.url))
    }

    if (!code) {
      console.error("Authorization code missing")
      return NextResponse.redirect(new URL("/dashboard?auth=no_code", request.url))
    }

    const appId = process.env.PINTEREST_APP_ID
    const appSecret = process.env.PINTEREST_APP_SECRET
    const redirectUri = process.env.PINTEREST_REDIRECT_URI

    if (!appId || !appSecret || !redirectUri) {
      console.error("Pinterest configuration missing:", {
        hasAppId: !!appId,
        hasAppSecret: !!appSecret,
        hasRedirectUri: !!redirectUri,
      })
      return NextResponse.redirect(new URL("/dashboard?auth=config_missing", request.url))
    }

    console.log("Exchanging code for token with params:", {
      code: code.substring(0, 5) + "...", // Log only part of the code for security
      redirectUri,
    })

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${appId}:${appSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    })

    const responseText = await tokenResponse.text()
    console.log("Token response status:", tokenResponse.status)

    let tokenData
    try {
      tokenData = JSON.parse(responseText)
      console.log("Token response parsed successfully:", {
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      })
    } catch (e) {
      console.error("Failed to parse token response:", responseText)
      return NextResponse.redirect(new URL("/dashboard?auth=token_parse_error", request.url))
    }

    if (!tokenResponse.ok) {
      console.error("Pinterest token error:", tokenData)
      return NextResponse.redirect(
        new URL(`/dashboard?auth=token_error&error=${encodeURIComponent(tokenData.error || "unknown")}`, request.url),
      )
    }

    const { access_token, refresh_token, expires_in } = tokenData

    // Create a response that redirects to the dashboard
    const response = NextResponse.redirect(new URL("/dashboard?auth=success", request.url))

    // Set cookies with the tokens
    response.cookies.set("pinterest_access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
      sameSite: "lax",
    })

    if (refresh_token) {
      response.cookies.set("pinterest_refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
      })
    }

    // Clear the state cookie
    response.cookies.set("pinterest_auth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "lax",
    })

    console.log("Authentication successful, redirecting to dashboard")
    return response
  } catch (error) {
    console.error("Error handling Pinterest callback:", error)
    return NextResponse.redirect(new URL("/dashboard?auth=server_error", request.url))
  }
}
