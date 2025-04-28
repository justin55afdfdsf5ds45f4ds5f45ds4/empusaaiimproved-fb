import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const falApiKey = process.env.FAL_AI

    if (!falApiKey) {
      return NextResponse.json({ error: "FAL AI API key is missing" }, { status: 500 })
    }

    // Call FAL AI API to generate an image
    const response = await fetch("https://api.fal.ai/v1/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${falApiKey}`,
      },
      body: JSON.stringify({
        model: "fal-ai/fast-sdxl",
        prompt: prompt,
        width: 600,
        height: 900,
        num_images: 1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("FAL AI error:", errorData)
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
