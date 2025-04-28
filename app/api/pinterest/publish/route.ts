import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = request.cookies.get("pinterest_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated with Pinterest" }, { status: 401 })
    }

    const { boardId, title, description, imageUrl } = await request.json()

    if (!boardId || !title || !description || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a Pinterest pin
    const pinResponse = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        board_id: boardId,
        title,
        description,
        media_source: {
          source_type: "image_url",
          url: imageUrl,
        },
        alt_text: title,
      }),
    })

    if (!pinResponse.ok) {
      const errorData = await pinResponse.json()
      console.error("Pinterest pin creation error:", errorData)
      return NextResponse.json({ error: "Failed to create pin" }, { status: 500 })
    }

    const pinData = await pinResponse.json()

    return NextResponse.json({
      success: true,
      message: "Pin published successfully",
      pinId: pinData.id,
    })
  } catch (error) {
    console.error("Error publishing pin:", error)
    return NextResponse.json({ error: "Failed to publish pin" }, { status: 500 })
  }
}
