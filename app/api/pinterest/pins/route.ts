import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { refreshPinterestToken } from "@/lib/pinterest"

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const { boardId, imageUrl, title, description } = await req.json()

    // Validate required fields
    if (!boardId || !imageUrl || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

    // Create a new pin on Pinterest
    const pinResponse = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
        media_source: {
          source_type: "image_url",
          url: imageUrl,
        },
        title,
        description: description || "",
        alt_text: title,
      }),
    })

    if (!pinResponse.ok) {
      const errorText = await pinResponse.text()
      console.error("Pinterest pin creation error:", errorText)

      // If unauthorized, the token might be invalid
      if (pinResponse.status === 401) {
        return NextResponse.json({ error: "Pinterest authorization expired" }, { status: 401 })
      }

      return NextResponse.json({ error: "Failed to create Pinterest pin" }, { status: pinResponse.status })
    }

    const pinData = await pinResponse.json()

    // Store the pin in the database
    await db.collection("pins").insertOne({
      userId: user._id,
      pinterestId: pinData.id,
      boardId,
      title,
      description: description || "",
      imageUrl,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      pin: {
        id: pinData.id,
        url: pinData.url || `https://www.pinterest.com/pin/${pinData.id}/`,
      },
    })
  } catch (error) {
    console.error("Pinterest pin creation error:", error)
    return NextResponse.json({ error: "Failed to create Pinterest pin" }, { status: 500 })
  }
}
