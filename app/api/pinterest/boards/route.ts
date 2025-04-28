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
      return NextResponse.json({ error: "Not authenticated with Pinterest" }, { status: 401 })
    }

    // Get the user's Pinterest boards
    const boardsResponse = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!boardsResponse.ok) {
      const errorData = await boardsResponse.json()
      console.error("Pinterest boards error:", errorData)
      return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 })
    }

    const boardsData = await boardsResponse.json()

    return NextResponse.json(boardsData)
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 })
  }
}
