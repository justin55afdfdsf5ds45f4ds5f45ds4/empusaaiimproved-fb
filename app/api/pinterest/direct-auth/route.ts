import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Direct Pinterest auth handler called")

    const formData = await request.formData()
    const code = formData.get("code") as string
    const state = formData.get("state") as string

    console.log("Auth parameters:", {
      hasCode: !!code,
      hasState: !!state,
    })

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "No authorization code provided",
        },
        { status: 400 },
      )
    }

    // For development mode, allow mock authentication
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock authentication in development mode")

      // Set mock access token
      const response = NextResponse.json({
        success: true,
        message: "Development mode: Mock authentication successful",
      })

      response.cookies.set("pinterest_access_token", "mock-access-token", {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      return response
    }

    // Get Pinterest credentials
    const appId = process.env.PINTEREST_APP_ID
    const appSecret = process.env.PINTEREST_APP_SECRET
    const redirectUri =
      process.env.PINTEREST_REDIRECT_URI ||
      (process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/pinterest-callback` : null)

    if (!appId || !appSecret || !redirectUri) {
      console.error("Pinterest credentials missing:", {
        hasAppId: !!appId,
        hasAppSecret: !!appSecret,
        hasRedirectUri: !!redirectUri,
      })

      return NextResponse.json(
        {
          success: false,
          message: "Pinterest API credentials are not configured",
        },
        { status: 500 },
      )
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

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error("Pinterest token error:", errorText)

        return NextResponse.json(
          {
            success: false,
            message: `Failed to exchange code for token: ${tokenResponse.status}`,
          },
          { status: 500 },
        )
      }

      const tokenData = await tokenResponse.json()
      console.log("Token received successfully")

      const { access_token, refresh_token, expires_in } = tokenData

      // Create a successful response
      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
      })

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
          sameSite: "lax",
        })
      }

      return response
    } catch (error) {
      console.error("Error exchanging code for token:", error)

      return NextResponse.json(
        {
          success: false,
          message: "Failed to exchange authorization code for access token",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in direct Pinterest auth:", error)

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
