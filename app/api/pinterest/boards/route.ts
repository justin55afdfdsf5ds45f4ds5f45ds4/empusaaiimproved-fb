import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get the access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("pinterest_access_token")?.value

    // For development, use mock data if no token is available
    if (!accessToken && process.env.NODE_ENV === "development") {
      console.log("Using mock boards in development mode")
      return NextResponse.json({
        items: [
          {
            id: "board-1",
            name: "Travel Inspiration",
          },
          {
            id: "board-2",
            name: "Food & Recipes",
          },
          {
            id: "board-3",
            name: "Home Decor",
          },
        ],
      })
    }

    if (!accessToken) {
      console.error("No Pinterest access token found")
      return NextResponse.json({ error: "Pinterest authentication required" }, { status: 401 })
    }

    console.log("Fetching Pinterest boards with token")

    // Make the API call to Pinterest
    const response = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Pinterest API error:", errorText)

      // If unauthorized, return 401 to trigger re-authentication
      if (response.status === 401) {
        return NextResponse.json({ error: "Pinterest authentication expired" }, { status: 401 })
      }

      return NextResponse.json(
        { error: `Pinterest API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Successfully fetched Pinterest boards:", data.items?.length || 0, "boards")

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return NextResponse.json(
      { error: `Failed to fetch Pinterest boards: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
