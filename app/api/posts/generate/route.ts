import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { extractContentFromUrl } from "@/lib/url-extractor"

// Mock data for Pinterest posts
const MOCK_TOPICS = {
  travel: [
    {
      title: "10 Hidden Gems in Europe You Need to Visit",
      description:
        "Discover these secret European destinations that tourists haven't overrun yet. Perfect for your next adventure!",
      imagePrompt: "Beautiful hidden village in Tuscany with cobblestone streets and flowering balconies",
    },
    {
      title: "Ultimate Packing Guide for Long-Term Travel",
      description: "Everything you need to pack for a 3+ month journey around the world. Travel light and smart!",
      imagePrompt: "Neatly organized travel backpack with essential items laid out nearby",
    },
    {
      title: "Budget Travel: How to See the World for Less",
      description: "Tips and tricks to travel on a shoestring budget without sacrificing amazing experiences.",
      imagePrompt: "Person with backpack looking at sunset over beautiful landscape, budget travel concept",
    },
  ],
  food: [
    {
      title: "5-Ingredient Weeknight Dinners",
      description:
        "Quick, easy, and delicious dinner recipes that only need 5 ingredients. Perfect for busy weeknights!",
      imagePrompt: "Overhead view of a simple, colorful dinner plate with pasta, vegetables and herbs",
    },
    {
      title: "Healthy Breakfast Bowls to Start Your Day Right",
      description: "Nutritious and Instagram-worthy breakfast bowl ideas that will keep you energized all morning.",
      imagePrompt: "Vibrant smoothie bowl with colorful fruit toppings, granola and coconut flakes",
    },
    {
      title: "Decadent Chocolate Desserts for Any Occasion",
      description:
        "Indulgent chocolate dessert recipes that will satisfy any sweet tooth. Perfect for special occasions!",
      imagePrompt: "Close-up of rich, dark chocolate cake with melting chocolate ganache topping",
    },
  ],
  fitness: [
    {
      title: "30-Day Home Workout Challenge - No Equipment Needed",
      description: "Transform your body in just 30 days with these effective home workouts. No gym required!",
      imagePrompt: "Person doing push-ups in bright, minimalist home setting with workout calendar visible",
    },
    {
      title: "10 Yoga Poses for Better Sleep",
      description: "Try these relaxing yoga poses before bed to combat insomnia and wake up refreshed.",
      imagePrompt: "Person in calming yoga pose with soft evening lighting in bedroom setting",
    },
    {
      title: "Beginner's Guide to Strength Training",
      description: "Everything you need to know to start building strength safely and effectively.",
      imagePrompt: "Person with beginner-friendly dumbbells in bright gym setting with encouraging atmosphere",
    },
  ],
  home: [
    {
      title: "Small Space Organization Hacks",
      description: "Clever storage solutions and organization ideas for apartments and small homes.",
      imagePrompt: "Beautifully organized small apartment with clever storage solutions and minimalist decor",
    },
    {
      title: "DIY Weekend Home Projects Under $100",
      description: "Transform your space with these budget-friendly DIY projects you can complete in a weekend.",
      imagePrompt: "Person completing simple DIY shelf installation with basic tools and materials",
    },
    {
      title: "Indoor Plants for Beginners: Hard to Kill Varieties",
      description: "The best low-maintenance indoor plants that will thrive even if you don't have a green thumb.",
      imagePrompt: "Collection of beautiful, easy-care houseplants in stylish pots in bright room",
    },
  ],
  fashion: [
    {
      title: "Capsule Wardrobe Essentials for Every Season",
      description: "Build a versatile capsule wardrobe with these timeless pieces that mix and match perfectly.",
      imagePrompt: "Neatly arranged capsule wardrobe with neutral colors and classic pieces on clothing rack",
    },
    {
      title: "How to Style One Dress Five Different Ways",
      description: "Maximize your wardrobe by learning how to transform one simple dress for multiple occasions.",
      imagePrompt: "Fashion collage showing same dress styled five different ways with accessories and layers",
    },
    {
      title: "Sustainable Fashion Brands Worth Investing In",
      description: "Ethical and eco-friendly fashion brands that create beautiful, long-lasting pieces.",
      imagePrompt: "Sustainable fashion items made from natural materials with eco-friendly packaging",
    },
  ],
}

// Generic posts for any topic
const GENERIC_POSTS = [
  {
    title: "10 Essential Tips Every Beginner Should Know",
    description: "Starting out can be overwhelming. Here are the most important things to know before you begin.",
    imagePrompt: "Beginner-friendly setup with labeled tools and instructions",
  },
  {
    title: "The Ultimate Guide for 2023",
    description: "Everything you need to know about the latest trends, techniques, and tools for success this year.",
    imagePrompt: "Modern workspace with trending items and inspirational elements",
  },
  {
    title: "5 Common Mistakes to Avoid",
    description: "Learn from others' errors and save yourself time, money, and frustration with these important tips.",
    imagePrompt: "Infographic style image showing common mistakes and their solutions",
  },
  {
    title: "How to Create a Perfect Pinterest Strategy",
    description:
      "Boost your Pinterest presence with these proven strategies for creating engaging pins that drive traffic.",
    imagePrompt: "Person planning Pinterest content with organized mood boards and analytics",
  },
  {
    title: "Trending Now: What's Hot This Season",
    description: "Stay ahead of the curve with these emerging trends that are taking over Pinterest and social media.",
    imagePrompt: "Collage of trending items, colors, and styles for the current season",
  },
]

export async function POST(req: Request) {
  try {
    console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
    console.log(
      "OPENAI_API_KEY first 5 chars:",
      process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 5) : "not found",
    )

    // For development, allow without authentication in development mode
    const session = await getServerSession(authOptions)
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, topic, tone, count = 10 } = await req.json()

    if (!url && !topic) {
      return NextResponse.json({ error: "URL or topic is required" }, { status: 400 })
    }

    console.log(`Generating posts with: ${url ? "URL: " + url : "Topic: " + topic}`)
    console.log(`Count: ${count}, Tone: ${tone || "default"}`)

    // Extract content from the URL if provided
    let content = ""
    if (url) {
      try {
        content = await extractContentFromUrl(url)
        console.log(`Content extracted successfully (${content.length} chars)`)
      } catch (error) {
        console.error("Error extracting content from URL:", error)
        return NextResponse.json(
          {
            error: `Failed to extract content from URL: ${error instanceof Error ? error.message : String(error)}`,
          },
          { status: 500 },
        )
      }
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      return NextResponse.json({ error: "Server configuration error: OpenAI API key is missing" }, { status: 500 })
    }

    // Determine which mock data to use
    let postsToUse = [...GENERIC_POSTS]

    // Extract keywords from URL or use provided topic
    const keywords = topic ? topic.toLowerCase().split(/[,\s]+/) : url ? extractKeywordsFromUrl(url) : ["general"]

    // Add topic-specific posts if we have them
    keywords.forEach((keyword) => {
      const matchedTopic = Object.keys(MOCK_TOPICS).find((t) => keyword.includes(t) || t.includes(keyword))

      if (matchedTopic) {
        postsToUse = [...postsToUse, ...MOCK_TOPICS[matchedTopic]]
      }
    })

    // Shuffle and limit to requested count
    const shuffledPosts = shuffleArray(postsToUse).slice(0, Number(count))

    // Format the response
    const formattedPosts = shuffledPosts.map((post, index) => ({
      id: `post-${Date.now()}-${index}`,
      title: post.title,
      description: post.description,
      imagePrompt: post.imagePrompt,
      imageUrl: null,
    }))

    console.log(`Generated ${formattedPosts.length} mock posts`)
    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error("Error in post generation route:", error)
    return NextResponse.json(
      {
        error: `Failed to generate posts: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

// Helper function to extract keywords from URL
function extractKeywordsFromUrl(url: string): string[] {
  try {
    // Remove protocol and domain
    const urlPath = url.replace(/https?:\/\/[^/]+\//, "")

    // Split by common separators and filter out empty strings
    const keywords = urlPath
      .replace(/[_\-.]/g, " ") // Replace separators with spaces
      .split(/[/?&=#]/) // Split by URL parts
      .flatMap((part) => part.split(/\s+/)) // Split by spaces
      .filter((word) => word.length > 3) // Only words longer than 3 chars
      .map((word) => word.toLowerCase())
      .slice(0, 5) // Take only first 5 keywords

    return keywords.length > 0 ? keywords : ["general"]
  } catch {
    return ["general"]
  }
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
