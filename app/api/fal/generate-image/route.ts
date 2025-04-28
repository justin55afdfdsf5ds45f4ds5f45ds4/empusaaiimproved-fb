import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    // For development, allow without authentication
    const session = await getServerSession(authOptions)
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, referenceImageUrl } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const falApiKey = process.env.FAL_AI

    if (!falApiKey) {
      console.error("FAL AI API key is missing")
      return NextResponse.json({ error: "FAL AI API key is missing" }, { status: 500 })
    }

    console.log("Generating image with FAL AI...")
    console.log("Prompt:", prompt.substring(0, 100) + "...")
    console.log("Reference image:", referenceImageUrl ? "Provided" : "Not provided")

    // Prepare the request body
    const requestBody: any = {
      model: "fal-ai/fast-sdxl",
      prompt: prompt,
      width: 600,
      height: 900,
      num_images: 1,
    }

    // Add reference image if provided
    if (referenceImageUrl) {
      requestBody.image_url = referenceImageUrl
      requestBody.strength = 0.7 // Control how much influence the reference image has
    }

    try {
      // Call FAL AI API to generate an image
      const response = await fetch("https://api.fal.ai/v1/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${falApiKey}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("FAL AI error response:", errorData)
        return NextResponse.json(
          { error: `Failed to generate image: ${errorData.error || response.statusText}` },
          { status: response.status },
        )
      }

      const data = await response.json()
      console.log("Image generated successfully")

      return NextResponse.json(data)
    } catch (error) {
      console.error("Error calling FAL AI API:", error)
      return NextResponse.json({ error: "Failed to call image generation API" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in image generation route:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
