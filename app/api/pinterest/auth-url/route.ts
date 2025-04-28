import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get Pinterest credentials from environment variables
    const appId = process.env.PINTEREST_APP_ID

    // Use the correct redirect URI that matches what's configured in Pinterest
    // This should be the same as PINTEREST_REDIRECT_URI in your env vars
    // But we'll default to the new callback page we created
    const redirectUri =
      process.env.PINTEREST_REDIRECT_URI ||
      (process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/pinterest-callback` : null)

    // Log the environment variables for debugging
    console.log("Pinterest credentials:", {
      appId: appId ? "present" : "missing",
      redirectUri: redirectUri ? "present" : "missing",
    })

    // Check if credentials are available
    if (!appId || !redirectUri) {
      console.error("Pinterest configuration missing:", {
        appId: !!appId,
        redirectUri: !!redirectUri,
      })

      // For development, provide a mock URL if credentials are missing
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock Pinterest auth URL for development")
        const mockUrl = "https://www.pinterest.com/oauth/?mock=true"

        const response = NextResponse.json({ url: mockUrl })
        response.cookies.set("pinterest_auth_state", "mock-state", {
          httpOnly: true,
          maxAge: 60 * 10, // 10 minutes
          path: "/",
        })

        return response
      }

      return NextResponse.json({ error: "Pinterest configuration missing" }, { status: 500 })
    }

    // Generate a random state to prevent CSRF attacks
    const state = Math.random().toString(36).substring(2, 15)

    // Construct the Pinterest OAuth URL
    const url = new URL("https://www.pinterest.com/oauth/")
    url.searchParams.append("client_id", appId)
    url.searchParams.append("redirect_uri", redirectUri)
    url.searchParams.append("response_type", "code")
    url.searchParams.append("scope", "boards:read,pins:read,pins:write")
    url.searchParams.append("state", state)

    console.log("Generated Pinterest OAuth URL (without sensitive data)")

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
    return NextResponse.json(
      {
        error: "Failed to generate auth URL",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
