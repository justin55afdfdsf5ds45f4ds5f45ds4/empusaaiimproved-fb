import { NextResponse } from "next/server"
import { extractContentFromUrl } from "@/lib/url-extractor"

// Mock OpenAI for demo purposes
const mockOpenAI = {
  chat: {
    completions: {
      create: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                posts: Array.from({ length: 10 }, (_, i) => ({
                  title: `Pinterest Post ${i + 1}`,
                  description: `This is an AI-generated Pinterest post description optimized for engagement. It includes relevant keywords and a call to action.`,
                })),
              }),
            },
          },
        ],
      }),
    },
  },
}

export async function POST(req: Request) {
  try {
    // Skip authentication for demo purposes
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { url, count = 10 } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Extract content from the URL
    const content = await extractContentFromUrl(url)

    // Use mock OpenAI for demo purposes
    const openai = process.env.OPENAI_API_KEY
      ? (await import("openai")).default.OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        })
      : mockOpenAI

    // Generate Pinterest post ideas using OpenAI or mock
    let responseText
    try {
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
      responseText = completion.choices[0].message.content
    } catch (error) {
      console.error("Error with OpenAI:", error)
      // Fallback to mock data
      responseText = JSON.stringify({
        posts: Array.from({ length: Number.parseInt(count.toString()) }, (_, i) => ({
          title: `Pinterest Post ${i + 1}`,
          description: `This is an AI-generated Pinterest post description optimized for engagement. It includes relevant keywords and a call to action.`,
        })),
      })
    }

    let postIdeas = []

    try {
      const parsedResponse = JSON.parse(responseText || "{}")
      postIdeas = parsedResponse.posts || []
    } catch (error) {
      console.error("Error parsing response:", error)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    // Generate mock image URLs for each post
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
