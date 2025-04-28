import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", isAuthenticated: false }, { status: 401 })
    }

    const accessToken = request.cookies.get("pinterest_access_token")?.value
    const refreshToken = request.cookies.get("pinterest_refresh_token")?.value

    console.log("Checking Pinterest auth:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    })

    if (!accessToken) {
      return NextResponse.json({ isAuthenticated: false })
    }

    // Verify the token is valid by making a request to the Pinterest API
    try {
      const userResponse = await fetch("https://api.pinterest.com/v5/user_account", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      console.log("Pinterest API user account response status:", userResponse.status)

      if (!userResponse.ok) {
        // Token is invalid or expired
        console.error("Invalid or expired token:", await userResponse.text())

        // Try to refresh the token if we have a refresh token
        if (refreshToken) {
          console.log("Attempting to refresh token")
          // Implement token refresh logic here
          // For now, just clear the invalid token
        }

        const response = NextResponse.json({ isAuthenticated: false })

        // Clear the invalid token
        response.cookies.set("pinterest_access_token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 0,
          path: "/",
          sameSite: "lax",
        })

        return response
      }

      // Token is valid
      return NextResponse.json({
        isAuthenticated: true,
        accessToken,
      })
    } catch (error) {
      console.error("Error verifying Pinterest token:", error)
      return NextResponse.json({ isAuthenticated: false, error: "Failed to verify token" })
    }
  } catch (error) {
    console.error("Error checking Pinterest auth:", error)
    return NextResponse.json({ isAuthenticated: false, error: "Failed to check auth status" })
  }
}
