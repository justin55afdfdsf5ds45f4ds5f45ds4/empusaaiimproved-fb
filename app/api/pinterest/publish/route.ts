import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, boardId } = body

    if (!title || !description || !imageUrl || !boardId) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, imageUrl, and boardId are required" },
        { status: 400 },
      )
    }

    console.log("Publishing pin to Pinterest with:", { title, boardId })

    // Get the session
    const session = await getServerSession(authOptions)

    if (!session) {
      console.error("No session found")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get the access token from the session
    const accessToken = session.accessToken

    if (!accessToken) {
      console.error("No Pinterest access token found in session")
      return NextResponse.json({ error: "Pinterest authentication required" }, { status: 401 })
    }

    // Create the pin on Pinterest
    const pinData = {
      board_id: boardId,
      media_source: {
        source_type: "image_url",
        url: imageUrl,
      },
      title,
      description,
      alt_text: title,
    }

    console.log("Sending pin data to Pinterest API:", JSON.stringify(pinData))

    const response = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(pinData),
    })

    if (!response.ok) {
      console.error("Error creating Pinterest pin:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error details:", errorText)
      return NextResponse.json(
        { error: `Failed to create pin: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Pin created successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Pin published successfully",
      pin: data,
    })
  } catch (error) {
    console.error("Error publishing pin:", error)
    return NextResponse.json(
      { error: `Failed to publish pin: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
