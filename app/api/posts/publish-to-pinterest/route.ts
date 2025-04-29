import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated with Pinterest" }, { status: 401 })
    }

    const { title, description, imageUrl, boardId } = await request.json()

    if (!title || !description || !imageUrl || !boardId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use the access token to publish to Pinterest API
    const response = await fetch(`https://api.pinterest.com/v5/pins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
        title,
        description,
        media_source: {
          source_type: "image_url",
          url: imageUrl,
        },
      }),
    })

    if (!response.ok) {
      console.error("Failed to publish to Pinterest:", await response.text())
      return NextResponse.json({ error: "Failed to publish to Pinterest" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      pinId: data.id,
      url: data.url,
    })
  } catch (error) {
    console.error("Error publishing to Pinterest:", error)
    return NextResponse.json({ error: "Failed to publish to Pinterest" }, { status: 500 })
  }
}
