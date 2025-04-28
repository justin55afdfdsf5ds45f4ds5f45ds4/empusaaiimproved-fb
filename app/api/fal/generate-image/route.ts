import { NextResponse } from "next/server"

// Array of placeholder image URLs
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1000",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000",
  "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?q=80&w=1000",
  "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1000",
  "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000",
]

export async function POST(req: Request) {
  try {
    // Parse the request
    const { prompt } = await req.json()

    console.log(`Generating image with prompt: ${prompt}`)

    // Simulate a delay to mimic API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Select a random placeholder image
    const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)
    const imageUrl = PLACEHOLDER_IMAGES[randomIndex]

    console.log(`Generated image: ${imageUrl}`)

    return NextResponse.json({
      images: [
        {
          url: imageUrl,
        },
      ],
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      {
        error: `Failed to generate image: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
