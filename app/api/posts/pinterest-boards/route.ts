import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      console.error("No session or access token found")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("Fetching Pinterest boards")

    // Call the Pinterest API to get boards
    const response = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Pinterest API error:", errorText)
      return NextResponse.json({ error: `Pinterest API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log(`Fetched ${data.items?.length || 0} boards`)

    // Return the boards
    return NextResponse.json({ boards: data.items || [] })
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return NextResponse.json(
      { error: `Failed to fetch Pinterest boards: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
