import { NextResponse } from "next/server"

// Array of placeholder image URLs
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1964&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=2070&auto=format&fit=crop",
]

export async function POST() {
  try {
    // Return a random placeholder image
    const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)
    const imageUrl = PLACEHOLDER_IMAGES[randomIndex]

    return NextResponse.json({
      images: [{ url: imageUrl }],
    })
  } catch (error) {
    console.error("Error in image generation route:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}
