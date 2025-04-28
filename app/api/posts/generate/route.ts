import { NextResponse } from "next/server"

// Hardcoded mock posts that will always work
const MOCK_POSTS = [
  {
    id: "post-1",
    title: "10 Essential Travel Tips for Budget Explorers",
    description:
      "Discover how to see the world without breaking the bank. These budget travel tips will help you maximize experiences while minimizing costs.",
    imagePrompt: "Person with backpack overlooking mountain landscape at sunset",
    imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "post-2",
    title: "Simple 5-Ingredient Weeknight Dinner Ideas",
    description: "Quick, easy, and delicious dinner recipes that only need 5 ingredients. Perfect for busy weeknights!",
    imagePrompt: "Overhead view of a simple, colorful dinner plate with pasta",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop",
  },
  {
    id: "post-3",
    title: "Home Office Organization Hacks",
    description:
      "Transform your workspace with these clever organization ideas that boost productivity and create a stylish environment.",
    imagePrompt: "Organized minimalist home office with plants and natural light",
    imageUrl: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "post-4",
    title: "Indoor Plants That Thrive in Low Light",
    description:
      "Bring nature indoors with these beautiful plants that don't need much sunlight to flourish. Perfect for apartments!",
    imagePrompt: "Collection of indoor plants in stylish pots in a cozy room corner",
    imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "post-5",
    title: "30-Day Fitness Challenge for Beginners",
    description:
      "Start your fitness journey with this approachable 30-day challenge designed specifically for beginners. No equipment needed!",
    imagePrompt: "Person in workout clothes stretching in bright living room",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "post-6",
    title: "DIY Natural Home Cleaning Solutions",
    description:
      "Make your own eco-friendly cleaning products with simple ingredients. Better for your health and the environment!",
    imagePrompt: "Natural cleaning products in glass containers with fresh lemons and baking soda",
    imageUrl: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "post-7",
    title: "Capsule Wardrobe Essentials for Every Season",
    description:
      "Build a versatile capsule wardrobe with these timeless pieces that mix and match perfectly for year-round style.",
    imagePrompt: "Neatly arranged capsule wardrobe with neutral colors on clothing rack",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "post-8",
    title: "5-Minute Meditation Techniques for Busy People",
    description:
      "Find calm in the chaos with these quick meditation practices that fit into even the busiest schedule.",
    imagePrompt: "Person meditating in peaceful home setting with morning light",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop",
  },
  {
    id: "post-9",
    title: "Creative Wall Art Ideas for Any Budget",
    description: "Transform your space with these wall decor ideas ranging from DIY projects to affordable art finds.",
    imagePrompt: "Gallery wall with mix of framed art, photos and decorative items",
    imageUrl: "https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "post-10",
    title: "Healthy Breakfast Bowls to Start Your Day Right",
    description: "Nutritious and Instagram-worthy breakfast bowl ideas that will keep you energized all morning.",
    imagePrompt: "Vibrant smoothie bowl with colorful fruit toppings and granola",
    imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1964&auto=format&fit=crop",
  },
]

export async function POST(req: Request) {
  try {
    // Return hardcoded posts without any processing
    return NextResponse.json({ posts: MOCK_POSTS })
  } catch (error) {
    console.error("Error in post generation route:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}
