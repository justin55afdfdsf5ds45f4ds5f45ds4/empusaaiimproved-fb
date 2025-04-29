import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Mock boards for development/testing
const MOCK_BOARDS = [
  { id: "board1", name: "Travel Ideas", url: "https://pinterest.com/board1" },
  { id: "board2", name: "Food Recipes", url: "https://pinterest.com/board2" },
  { id: "board3", name: "Home Decor", url: "https://pinterest.com/board3" },
  { id: "board4", name: "DIY Projects", url: "https://pinterest.com/board4" },
  { id: "board5", name: "Fashion Inspiration", url: "https://pinterest.com/board5" },
]

export async function GET(request: Request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    if (!session) {
      console.log("No session found, returning mock boards")
      return NextResponse.json({ boards: MOCK_BOARDS })
    }

    // Get the access token from the session
    const accessToken = session.accessToken

    if (!accessToken) {
      console.log("No Pinterest access token found in session, returning mock boards")
      return NextResponse.json({ boards: MOCK_BOARDS })
    }

    console.log("Fetching Pinterest boards with access token")

    // Fetch boards from Pinterest API
    const response = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.error("Error fetching Pinterest boards:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error details:", errorText)

      // Return mock boards if there's an error
      return NextResponse.json({ boards: MOCK_BOARDS })
    }

    const data = await response.json()
    console.log("Pinterest boards fetched successfully")

    // Transform the response to match our expected format
    const boards = data.items.map((board: any) => ({
      id: board.id,
      name: board.name,
      url: board.url || `https://pinterest.com/${board.id}`,
    }))

    return NextResponse.json({ boards })
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return NextResponse.json({ boards: MOCK_BOARDS })
  }
}
