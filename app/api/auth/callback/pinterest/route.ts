import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Pinterest callback received at /api/auth/callback/pinterest")

    // Get the code and state from the URL
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const storedState = request.cookies.get("pinterest_auth_state")?.value
    const error = searchParams.get("error")

    console.log("Pinterest callback params:", {
      hasCode: !!code,
      hasState: !!state,
      hasStoredState: !!storedState,
      error: error || "none",
    })

    // Check for error parameter
    if (error) {
      console.error("Pinterest OAuth error:", error)
      return NextResponse.redirect(new URL("/dashboard?auth=error", request.url))
    }

    // For development mode, allow bypassing state validation
    if (process.env.NODE_ENV === "development" && (!storedState || state === "mock-state")) {
      console.log("Using mock authentication in development mode")

      // Set mock access token
      const response = NextResponse.redirect(new URL("/dashboard?auth=success", request.url))
      response.cookies.set("pinterest_access_token", "mock-access-token", {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      return response
    }

    // Verify state to prevent CSRF attacks (with some leniency in development)
    if (process.env.NODE_ENV !== "development" && (!state || !storedState || state !== storedState)) {
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

    // For development, use mock tokens if credentials are missing
    if ((!appId || !appSecret || !redirectUri) && process.env.NODE_ENV === "development") {
      console.log("Using mock tokens in development mode due to missing credentials")

      const response = NextResponse.redirect(new URL("/dashboard?auth=success&dev=true", request.url))
      response.cookies.set("pinterest_access_token", "mock-access-token", {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      return response
    }

    if (!appId || !appSecret || !redirectUri) {
      console.error("Pinterest configuration missing:", {
        hasAppId: !!appId,
        hasAppSecret: !!appSecret,
        hasRedirectUri: !!redirectUri,
      })
      return NextResponse.redirect(new URL("/dashboard?auth=config_missing", request.url))
    }

    console.log("Exchanging code for token")

    try {
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

      const responseStatus = tokenResponse.status
      console.log("Token response status:", responseStatus)

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error("Pinterest token error:", errorText)
        return NextResponse.redirect(new URL(`/dashboard?auth=token_error&status=${responseStatus}`, request.url))
      }

      const tokenData = await tokenResponse.json()
      console.log("Token received successfully")

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
      console.error("Error exchanging code for token:", error)
      return NextResponse.redirect(new URL("/dashboard?auth=token_exchange_error", request.url))
    }
  } catch (error) {
    console.error("Error handling Pinterest callback:", error)
    return NextResponse.redirect(new URL("/dashboard?auth=server_error", request.url))
  }
}
