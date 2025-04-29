import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      console.error("No session or access token found")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse the request body
    const body = await req.json()
    const { title, description, imageUrl, boardId } = body

    if (!title || !description || !imageUrl || !boardId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Publishing to Pinterest:", { title, description, boardId })

    // Call the Pinterest API to create a pin
    const response = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
        title: title,
        description: description,
        media_source: {
          source_type: "image_url",
          url: imageUrl,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Pinterest API error:", errorText)
      return NextResponse.json({ error: `Pinterest API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("Pin created successfully:", data)

    return NextResponse.json({ success: true, pin: data })
  } catch (error) {
    console.error("Error publishing to Pinterest:", error)
    return NextResponse.json(
      { error: `Failed to publish to Pinterest: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
