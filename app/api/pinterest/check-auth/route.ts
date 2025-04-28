import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check for development mode mock authentication
    const mockState = request.cookies.get("pinterest_auth_state")?.value === "mock-state"

    if (process.env.NODE_ENV === "development" && mockState) {
      console.log("Using mock Pinterest authentication in development mode")

      // Set a mock access token cookie
      const response = NextResponse.json({
        isAuthenticated: true,
        accessToken: "mock-access-token",
      })

      response.cookies.set("pinterest_access_token", "mock-access-token", {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      return response
    }

    // Check for real authentication
    const accessToken = request.cookies.get("pinterest_access_token")?.value

    if (accessToken) {
      return NextResponse.json({
        isAuthenticated: true,
        accessToken: accessToken.substring(0, 5) + "...", // Only return a hint of the token for security
      })
    } else {
      return NextResponse.json({ isAuthenticated: false })
    }
  } catch (error) {
    console.error("Error checking Pinterest auth:", error)
    return NextResponse.json({
      isAuthenticated: false,
      error: "Failed to check auth status",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
