import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching Pinterest boards")

    // Get the access token from cookies
    const accessToken = request.cookies.get("pinterest_access_token")?.value

    // For development mode, return mock boards if no token or in development
    if (process.env.NODE_ENV === "development" && (!accessToken || accessToken === "mock-access-token")) {
      console.log("Using mock boards in development mode")
      return NextResponse.json({
        items: [
          { id: "mock-board-1", name: "Home Decor Ideas" },
          { id: "mock-board-2", name: "Travel Inspiration" },
          { id: "mock-board-3", name: "Recipes to Try" },
        ],
      })
    }

    if (!accessToken) {
      console.error("No Pinterest access token found")
      return NextResponse.json({ error: "Not authenticated with Pinterest" }, { status: 401 })
    }

    console.log("Fetching boards with access token")

    // Get the user's Pinterest boards
    const boardsResponse = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!boardsResponse.ok) {
      const errorData = await boardsResponse.json().catch(() => ({}))
      console.error("Pinterest boards error:", errorData)

      // If token is expired or invalid, clear it
      if (boardsResponse.status === 401) {
        const response = NextResponse.json({ error: "Pinterest authentication expired" }, { status: 401 })
        response.cookies.set("pinterest_access_token", "", { maxAge: 0, path: "/" })
        return response
      }

      return NextResponse.json({ error: "Failed to fetch boards", details: errorData }, { status: 500 })
    }

    const boardsData = await boardsResponse.json()
    console.log(`Successfully fetched ${boardsData.items?.length || 0} Pinterest boards`)

    return NextResponse.json(boardsData)
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch boards",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
