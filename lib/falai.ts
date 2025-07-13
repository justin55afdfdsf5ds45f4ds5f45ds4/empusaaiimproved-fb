import { fal } from "@fal-ai/client";

// Sample image URLs (FALLBACK MODE)
const FALLBACK_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1511649475669-e288648b2339?w=800&h=1200&fit=crop",
]

// Default dimensions for 9:16 aspect ratio
const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 1600;

export async function generateImage(prompt: string, width: number = DEFAULT_WIDTH, height: number = DEFAULT_HEIGHT) {
  try {
    if (!process.env.FALAI_API_KEY) {
      throw new Error("FALAI_API_KEY is not set in environment variables")
    }

    console.log("Calling FAL.ai API with prompt:", prompt.substring(0, 50) + "...")
    
    // Use the FALAI_MODEL_ID if available, otherwise use default model
    const modelId = process.env.FALAI_MODEL_ID || "fast-sdxl"

    fal.config({
      credentials: process.env.FALAI_API_KEY,
    });

    const res = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: prompt,
        width: width,
        height: height,
        sync_mode: true,
      },
    });

    const data = res.data
    
    // Handle the response based on Fal.ai's actual response format
    const imageUrl = data.images?.[0]?.url
    
    if (!imageUrl) {
      throw new Error("No image URL in response")
    }
    
    return imageUrl
  } catch (error) {
    console.error("Error generating image with Fal.ai:", error)
    throw error // Re-throw the error instead of falling back to Unsplash
  }
}
