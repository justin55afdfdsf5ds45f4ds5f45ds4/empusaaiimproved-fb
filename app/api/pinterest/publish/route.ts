import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    // Parse the request
    const { boardId, title, description, imageUrl } = await req.json()

    // Validate required fields
    if (!boardId || !title || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields: boardId, title, description, and imageUrl are required" },
        { status: 400 },
      )
    }

    // Get the access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("pinterest_access_token")?.value

    // For development, return mock response if no token is available
    if (!accessToken && process.env.NODE_ENV === "development") {
      console.log("Using mock publish in development mode")
      return NextResponse.json({
        success: true,
        id: `pin-${Date.now()}`,
        url: `https://pinterest.com/pin/${Date.now()}`,
        message: "Pin successfully published to Pinterest (MOCK)",
      })
    }

    if (!accessToken) {
      console.error("No Pinterest access token found")
      return NextResponse.json({ error: "Pinterest authentication required" }, { status: 401 })
    }

    console.log(`Publishing to Pinterest board ${boardId}:`)
    console.log(`Title: ${title}`)
    console.log(`Description: ${description.substring(0, 50)}...`)
    console.log(`Image URL: ${imageUrl}`)

    // Create the pin on Pinterest
    const response = await fetch(`https://api.pinterest.com/v5/pins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    console.log("Successfully published pin:", data)

    return NextResponse.json({
      success: true,
      id: data.id,
      url: `https://pinterest.com/pin/${data.id}`,
      message: "Pin successfully published to Pinterest",
    })
  } catch (error) {
    console.error("Error publishing to Pinterest:", error)
    return NextResponse.json(
      { error: `Failed to publish to Pinterest: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
