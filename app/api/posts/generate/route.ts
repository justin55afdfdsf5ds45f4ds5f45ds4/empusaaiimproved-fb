import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

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

// Sample image prompts
const IMAGE_PROMPTS = [
  "beautiful landscape with mountains and lake",
  "colorful abstract digital art",
  "minimalist interior design with plants",
  "delicious food photography with natural lighting",
  "fashion photography with urban background",
  "creative product photography with shadows",
  "architectural photography with geometric patterns",
  "portrait photography with bokeh background",
  "nature close-up with vibrant colors",
  "street photography with dramatic lighting",
]

// Sample image URLs from Unsplash
const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1511649475669-e288648b2339?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
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

// Function to extract keywords from URL or use provided topic
function extractKeywords(url: string | null, topic: string | null): string {
  if (topic && topic.trim().length > 0) {
    return topic.trim().toLowerCase()
  }

  if (url) {
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
  }

  // Default to a random topic if no keywords could be extracted
  return TOPICS[Math.floor(Math.random() * TOPICS.length)]
}

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
    const requestedCount = Math.min(Math.max(1, count), 20) // Limit between 1 and 20

    for (let i = 0; i < requestedCount; i++) {
      const post = {
        id: uuidv4(),
        title: generateTitle(keywords),
        description: generateDescription(keywords),
        imagePrompt: IMAGE_PROMPTS[Math.floor(Math.random() * IMAGE_PROMPTS.length)],
        imageUrl: IMAGE_URLS[Math.floor(Math.random() * IMAGE_URLS.length)],
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
