import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  try {
    // Get the Pinterest access token from cookies
    const cookieStore = cookies()
    const pinterestToken = cookieStore.get("pinterest_token")?.value

    if (!pinterestToken) {
      console.error("Pinterest token not found in cookies")
      return NextResponse.json(
        { error: "Pinterest authentication required. Please connect your Pinterest account." },
        { status: 401 },
      )
    }

    // Fetch the user's boards from Pinterest API
    const response = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${pinterestToken}`,
      },
      method: "GET",
    })

    if (!response.ok) {
      console.error("Failed to fetch Pinterest boards:", response.status, response.statusText)

      // If the token is invalid or expired
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Pinterest authentication expired. Please reconnect your Pinterest account." },
          { status: 401 },
        )
      }

      return NextResponse.json(
        { error: `Failed to fetch Pinterest boards: ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Log the response for debugging
    console.log("Pinterest boards response:", JSON.stringify(data))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return NextResponse.json({ error: "Failed to fetch Pinterest boards. Please try again." }, { status: 500 })
  }
}
