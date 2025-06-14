import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { generateImage } from "@/lib/openai"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

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
async function extractKeywords(url: string | null, topic: string | null): Promise<string | null> {
  if (topic && topic.trim().length > 0) {
    return topic.trim().toLowerCase()
  }

  if (url) {
    try {
      // Only try to use external APIs if we have the required API keys
      if (!process.env.FIRECRAWL_API_KEY || !process.env.OPENAI_API_KEY) {
        console.log("Missing API keys for URL extraction, using fallback")
        return null
      }

      if (!/^https?:\/\//.test(url)) throw new Error("Invalid URL")

      // Dynamic imports to avoid build-time issues
      const [{ default: FirecrawlApp }, { OpenAI }] = await Promise.all([import("firecrawl"), import("openai")])

      const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

      console.log("🔎 Scraping page:", url)
      const raw = await firecrawl.scrapeUrl(url, { onlyMainContent: false })

      if (!raw.success) {
        throw new Error(raw.error)
      }

      const pageText = raw.metadata?.description || ""

      if (!pageText.trim()) throw new Error("No usable content from Firecrawl")

      const sysPrompt = `You are a machine that extracts short, powerful keywords and phrases relevant for Pinterest-style poster design from webpage content. Extract only eye-catching headline-like phrases. Output must be one string of comma-separated phrases, lowercase, no paragraphs.`

      const chat = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.3,
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: pageText.slice(0, 8000) },
        ],
      })

      if (!chat.choices?.[0]?.message?.content) {
        throw new Error("No response content from OpenAI")
      }

      const keywords = chat.choices[0].message.content.trim()
      console.log("🗝️ Extracted keywords:", keywords)
      return keywords
    } catch (err: unknown) {
      console.error("❌ Error extracting keywords:", err instanceof Error ? err.message : String(err))
      return null
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
    const keywords = await extractKeywords(url, topic)

    // Generate the requested number of posts
    const requestedCount = count // Limit between 1 and 10

      const postPromises = Array.from({ length: requestedCount }).map(async () => {
        const title = generateTitle(keywords || "").split(",")[0]
        const description = generateDescription(keywords || "")
        const imagePrompt = generateImagePrompt(keywords || "")
        let imageUrl
  
        try {
          imageUrl = await generateImage(imagePrompt)
        } catch {
          imageUrl = FALLBACK_IMAGE_URLS[Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length)]
        }
  
        return {
          id: uuidv4(),
          title,
          description,
          imagePrompt,
          imageUrl,
        }
      })
  
    const posts = await Promise.all(postPromises)

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email: session.user.email })
    
    posts.forEach(async (post)=>{
      await db.collection("posts").insertOne({
        userId: user?._id,
        postId: post.id,
        title: post.title,
        description: post.description || "",
        imageUrl:post.imageUrl,
        createdAt: new Date(),
      })
    })
    

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
