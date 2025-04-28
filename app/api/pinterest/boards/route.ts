import { NextResponse } from "next/server"

// Hardcoded mock boards
const MOCK_BOARDS = {
  items: [
    {
      id: "board-1",
      name: "Travel Inspiration",
    },
    {
      id: "board-2",
      name: "Food & Recipes",
    },
    {
      id: "board-3",
      name: "Home Decor",
    },
  ],
}

export async function GET() {
  try {
    // Return hardcoded boards without any processing
    return NextResponse.json(MOCK_BOARDS)
  } catch (error) {
    console.error("Error in boards route:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}
