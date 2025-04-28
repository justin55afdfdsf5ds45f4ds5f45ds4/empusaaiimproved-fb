import { NextResponse } from "next/server"

// Mock Pinterest boards
const MOCK_BOARDS = [
  {
    id: "board-1",
    name: "Travel Inspiration",
    description: "Beautiful travel destinations and tips",
    image: {
      url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=500&fit=crop",
    },
  },
  {
    id: "board-2",
    name: "Food & Recipes",
    description: "Delicious recipes and food photography",
    image: {
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop",
    },
  },
  {
    id: "board-3",
    name: "Home Decor",
    description: "Interior design ideas and inspiration",
    image: {
      url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&h=500&fit=crop",
    },
  },
]

export async function GET(req: Request) {
  try {
    console.log("Fetching Pinterest boards")

    // Simulate a delay to mimic API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({
      items: MOCK_BOARDS,
      bookmark: null,
    })
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return NextResponse.json(
      {
        error: `Failed to fetch Pinterest boards: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
