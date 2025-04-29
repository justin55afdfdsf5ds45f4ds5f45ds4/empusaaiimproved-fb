import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get the access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("pinterest_access_token")?.value

    // For development, always consider authenticated
    if (process.env.NODE_ENV === "development" && !accessToken) {
      console.log("Development mode: Simulating authenticated state")
      return NextResponse.json({ isAuthenticated: true })
    }

    if (!accessToken) {
      console.log("No Pinterest access token found")
      return NextResponse.json({ isAuthenticated: false })
    }

    // Verify the token by making a simple API call
    const response = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.error("Pinterest token validation failed:", response.status, response.statusText)
      return NextResponse.json({ isAuthenticated: false })
    }

    console.log("Pinterest token is valid")
    return NextResponse.json({ isAuthenticated: true })
  } catch (error) {
    console.error("Error checking Pinterest auth:", error)
    return NextResponse.json({ isAuthenticated: false })
  }
}
