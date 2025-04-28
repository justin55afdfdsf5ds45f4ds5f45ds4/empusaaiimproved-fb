import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { extractContentFromUrl } from "@/lib/url-extractor"
import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // For development, allow without authentication
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, topic, tone, count = 10, referenceImageUrl } = await req.json()

    if (!url && !topic) {
      return NextResponse.json({ error: "URL or topic is required" }, { status: 400 })
    }

    // Extract content from the URL if provided
    let content = ""
    if (url) {
      content = await extractContentFromUrl(url)
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    // Generate Pinterest post ideas using OpenAI
    const promptContent = url
      ? `Content from URL: ${url}\n\n${content}`
      : `Generate Pinterest posts about the topic: ${topic} with a ${tone || "informative"} tone.`

    const systemPrompt = `You are a Pinterest marketing expert. Generate ${count} Pinterest post ideas based on the following content. 
    For each post, provide a catchy title and an SEO-optimized description that would perform well on Pinterest.
    Also provide a detailed image prompt that would work well for generating an AI image for Pinterest.
    Format your response as a JSON array with objects containing 'title', 'description', and 'imagePrompt' properties.
    The imagePrompt should be a detailed description for generating an image that would work well on Pinterest.
    ${referenceImageUrl ? "Use the reference image as inspiration for the image prompts." : ""}`

    console.log("Generating posts with OpenAI...")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: promptContent,
        },
      ],
      response_format: { type: "json_object" },
    })

    const responseText = completion.choices[0].message.content
    let postIdeas = []

    try {
      const parsedResponse = JSON.parse(responseText || "{}")
      postIdeas = parsedResponse.posts || []
      console.log(`Generated ${postIdeas.length} post ideas`)
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    // For now, return the post ideas without generating images
    // Images will be generated on demand when the user selects a post
    const posts = postIdeas.map((post, index) => ({
      id: `post-${Date.now()}-${index}`,
      title: post.title,
      description: post.description,
      imagePrompt: post.imagePrompt || `Pinterest post about ${post.title}`,
      imageUrl: null, // Will be generated on demand
    }))

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error generating posts:", error)
    return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 })
  }
}
