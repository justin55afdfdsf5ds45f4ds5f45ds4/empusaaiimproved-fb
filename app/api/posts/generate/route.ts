import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import OpenAI from "openai"
import { extractContentFromUrl } from "@/lib/url-extractor"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, count = 10 } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Extract content from the URL
    // In a production app, you would implement a proper web scraper
    // For now, we'll simulate this with a placeholder function
    const content = await extractContentFromUrl(url)

    // Generate Pinterest post ideas using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Pinterest marketing expert. Generate ${count} Pinterest post ideas based on the following content. 
          For each post, provide a catchy title and an SEO-optimized description that would perform well on Pinterest.
          Format your response as a JSON array with objects containing 'title' and 'description' properties.`,
        },
        {
          role: "user",
          content: `Content from URL: ${url}\n\n${content}`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const responseText = completion.choices[0].message.content
    let postIdeas = []

    try {
      const parsedResponse = JSON.parse(responseText || "{}")
      postIdeas = parsedResponse.posts || []
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    // Generate mock image URLs for each post
    // In a production app, you would use a real image generation API
    const posts = postIdeas.map((post, index) => ({
      id: `post-${index}`,
      title: post.title,
      description: post.description,
      imageUrl: `https://via.placeholder.com/600x900?text=Pinterest+Post+${index + 1}`,
    }))

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error generating posts:", error)
    return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 })
  }
}
