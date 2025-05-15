import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { refreshPinterestToken } from "@/lib/pinterest"

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's Pinterest tokens from the database
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user || !user.pinterest || !user.pinterest.accessToken) {
      return NextResponse.json({ error: "Pinterest account not connected" }, { status: 400 })
    }

    // Check if the token is expired and refresh if needed
    let accessToken = user.pinterest.accessToken
    if (user.pinterest.expiresAt && new Date(user.pinterest.expiresAt) < new Date()) {
      const refreshResult = await refreshPinterestToken(user.pinterest.refreshToken)
      if (refreshResult.success) {
        accessToken = refreshResult.accessToken
      } else {
        return NextResponse.json({ error: "Failed to refresh Pinterest token" }, { status: 401 })
      }
    }

    // Fetch the user's boards from Pinterest
    const boardsResponse = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!boardsResponse.ok) {
      const errorText = await boardsResponse.text()
      console.error("Pinterest boards fetch error:", errorText)

      // If unauthorized, the token might be invalid
      if (boardsResponse.status === 401) {
        return NextResponse.json({ error: "Pinterest authorization expired" }, { status: 401 })
      }

      return NextResponse.json({ error: "Failed to fetch Pinterest boards" }, { status: boardsResponse.status })
    }

    const boardsData = await boardsResponse.json()

    // Format the response
    const boards = boardsData.items.map((board: any) => ({
      id: board.id,
      name: board.name,
      description: board.description || "",
      url: board.url,
      imageUrl: board.media?.image_cover_url || null,
    }))

    return NextResponse.json({ boards })
  } catch (error) {
    console.error("Pinterest boards error:", error)
    return NextResponse.json({ error: "Failed to fetch Pinterest boards" }, { status: 500 })
  }
}
