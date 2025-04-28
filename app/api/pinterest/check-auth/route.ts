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

    // For development/testing purposes, we'll consider the user authenticated if they have any Pinterest-related cookies
    // In production, you would validate the token with Pinterest API
    if (accessToken) {
      return NextResponse.json({
        isAuthenticated: true,
        accessToken,
      })
    } else {
      return NextResponse.json({ isAuthenticated: false })
    }
  } catch (error) {
    console.error("Error checking Pinterest auth:", error)
    return NextResponse.json({ isAuthenticated: false, error: "Failed to check auth status" })
  }
}
