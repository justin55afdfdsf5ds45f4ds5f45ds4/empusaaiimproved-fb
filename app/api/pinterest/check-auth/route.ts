import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = request.cookies.get("pinterest_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ isAuthenticated: false })
    }

    // Verify the token is valid by making a request to the Pinterest API
    const userResponse = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      // Token is invalid or expired
      const response = NextResponse.json({ isAuthenticated: false })

      // Clear the invalid token
      response.cookies.set("pinterest_access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
      })

      return response
    }

    // Token is valid
    return NextResponse.json({
      isAuthenticated: true,
      accessToken,
    })
  } catch (error) {
    console.error("Error checking Pinterest auth:", error)
    return NextResponse.json({ isAuthenticated: false, error: "Failed to check auth status" })
  }
}
