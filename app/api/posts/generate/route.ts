import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { generateImage } from "@/lib/falai"

// Sample topics for generating content
const TOPICS = ["travel", "food", "fashion", "home decor", "fitness", "technology", "art", "beauty", "gardening", "diy"]

// Sample adjectives for titles
const ADJECTIVES = [
  "Amazing",
  "Incredible",
  "Beautiful",
  "Stunning",
  "Gorgeous",
  "Delicious",
  "Fantastic",
  "Wonderful",
  "Brilliant",
  "Creative",
  "Innovative",
  "Inspiring",
  "Elegant",
  "Stylish",
  "Modern",
]

// Function to generate a random title based on topic
function generateTitle(topic: string): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const randomNumber = Math.floor(Math.random() * 100) + 1

  const titleTemplates = [
    `${adjective} ${topic} Ideas for Your Next Project`,
    `${randomNumber} ${adjective} ${topic} Tips You Need to Try`,
    `How to Create ${adjective} ${topic} Designs`,
    `The Ultimate Guide to ${topic} in ${new Date().getFullYear()}`,
    `${adjective} ${topic} Inspiration for Every Day`,
  ]

  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
}

// Function to generate a random description based on topic
function generateDescription(topic: string): string {
  const descriptionTemplates = [
    `Discover amazing ${topic} ideas that will transform your approach. These creative solutions are perfect for beginners and experts alike.`,
    `Looking for ${topic} inspiration? Check out these incredible ideas that are trending right now. Perfect for your next project!`,
    `Elevate your ${topic} game with these professional tips and tricks. Save this pin for later when you need creative inspiration.`,
    `The best ${topic} ideas curated just for you. Follow for more inspiration and daily updates on the latest trends.`,
    `Transform your ${topic} experience with these innovative approaches. Click through to learn more about how to implement these ideas.`,
  ]

  return descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)]
}

// Function to generate an image prompt based on topic
function generateImagePrompt(topic: string): string {
  const promptTemplates = [
    `Beautiful ${topic} photography with natural lighting, professional quality, trending on Pinterest`,
    `Creative ${topic} design, high resolution, vibrant colors, Pinterest style`,
    `Inspirational ${topic} ideas, clean composition, soft lighting, Pinterest aesthetic`,
    `Modern ${topic} concept, minimalist style, perfect for social media, Pinterest trending`,
    `Stunning ${topic} visualization, professional photography, high detail, Pinterest worthy`,
  ]

  return promptTemplates[Math.floor(Math.random() * promptTemplates.length)]
}

// Function to extract keywords from URL or use provided topic
function extractKeywords(url: string | null, topic: string | null): string {
  if (topic && topic.trim().length > 0) {
    return topic.trim().toLowerCase()
  }

  if (url) {
    try {
      // Extract keywords from URL
      const urlObj = new URL(url)
      const path = urlObj.pathname.replace(/[^a-zA-Z0-9]/g, " ").trim()
      const query = urlObj.searchParams
        .toString()
        .replace(/[^a-zA-Z0-9]/g, " ")
        .trim()

      const keywords = `${path} ${query}`.toLowerCase()

      if (keywords.trim().length > 0) {
        return keywords
      }
    } catch (error) {
      console.error("Error parsing URL:", error)
    }
  }

  // Default to a random topic if no keywords could be extracted
  return TOPICS[Math.floor(Math.random() * TOPICS.length)]
}

// Fallback image URLs from Unsplash
const FALLBACK_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1511649475669-e288648b2339?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=1200&fit=crop",
]

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { url, topic, count = 10, tone = "informative" } = body

    console.log("Generating posts with:", { url, topic, count, tone })

    // Extract keywords from URL or use provided topic
    const keywords = extractKeywords(url, topic)
    console.log("Extracted keywords:", keywords)

    // Generate the requested number of posts
    const posts = []
    const requestedCount = Math.min(Math.max(1, count), 10) // Limit between 1 and 10

    for (let i = 0; i < requestedCount; i++) {
      const title = generateTitle(keywords)
      const description = generateDescription(keywords)
      const imagePrompt = generateImagePrompt(keywords)

      let imageUrl

      try {
        // Try to generate an image with Fal.ai
        console.log(`Generating image for prompt: ${imagePrompt}`)
        imageUrl = await generateImage(imagePrompt)
        console.log(`Generated image URL: ${imageUrl}`)
      } catch (error) {
        console.error("Error generating image with Fal.ai:", error)
        // Fallback to a random Unsplash image
        imageUrl = FALLBACK_IMAGE_URLS[Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length)]
        console.log(`Using fallback image URL: ${imageUrl}`)
      }

      const post = {
        id: uuidv4(),
        title,
        description,
        imagePrompt,
        imageUrl,
      }

      posts.push(post)
    }

    console.log(`Generated ${posts.length} posts`)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error generating posts:", error)
    return NextResponse.json(
      { error: `Failed to generate posts: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
