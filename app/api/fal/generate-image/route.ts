import { NextResponse } from "next/server"

// Sample image URLs from Unsplash for different categories
const IMAGE_URLS = {
  landscape: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=1200&fit=crop",
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=1200&fit=crop",
  ],
  technology: [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=1200&fit=crop",
  ],
  abstract: [
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1507908708918-778587c9e563?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=1200&fit=crop",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop",
  ],
}

// Function to determine the category based on prompt
function determineCategory(prompt: string): string {
  prompt = prompt.toLowerCase()

  if (
    prompt.includes("landscape") ||
    prompt.includes("nature") ||
    prompt.includes("mountain") ||
    prompt.includes("lake")
  ) {
    return "landscape"
  }

  if (prompt.includes("food") || prompt.includes("meal") || prompt.includes("dish") || prompt.includes("recipe")) {
    return "food"
  }

  if (
    prompt.includes("tech") ||
    prompt.includes("computer") ||
    prompt.includes("digital") ||
    prompt.includes("device")
  ) {
    return "technology"
  }

  if (
    prompt.includes("abstract") ||
    prompt.includes("art") ||
    prompt.includes("pattern") ||
    prompt.includes("design")
  ) {
    return "abstract"
  }

  if (
    prompt.includes("fashion") ||
    prompt.includes("style") ||
    prompt.includes("clothing") ||
    prompt.includes("outfit")
  ) {
    return "fashion"
  }

  // Default to a random category
  const categories = Object.keys(IMAGE_URLS)
  return categories[Math.floor(Math.random() * categories.length)]
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Generating image for prompt:", prompt)

    // Determine the category based on the prompt
    const category = determineCategory(prompt)
    console.log("Determined category:", category)

    // Get a random image URL from the category
    const categoryUrls = IMAGE_URLS[category as keyof typeof IMAGE_URLS]
    const imageUrl = categoryUrls[Math.floor(Math.random() * categoryUrls.length)]

    // For real FAL AI integration, we would use the FAL_AI environment variable here
    // But for now, we'll just return a placeholder image

    // Simulate a delay to mimic API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1200,
        },
      ],
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      { error: `Failed to generate image: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
