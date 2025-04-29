import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated with Pinterest" }, { status: 401 })
    }

    // Use the access token to fetch boards from Pinterest API
    const response = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      // If the API call fails, return mock data for development
      console.error("Failed to fetch Pinterest boards:", await response.text())

      // Return mock boards for development
      return NextResponse.json({
        boards: [
          { id: "mock-board-1", name: "Travel Ideas", url: "#" },
          { id: "mock-board-2", name: "Food Recipes", url: "#" },
          { id: "mock-board-3", name: "Home Decor", url: "#" },
        ],
      })
    }

    const data = await response.json()

    return NextResponse.json({
      boards: data.items.map((board: any) => ({
        id: board.id,
        name: board.name,
        url: board.url,
      })),
    })
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return NextResponse.json({ error: "Failed to fetch Pinterest boards" }, { status: 500 })
  }
}
