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

export async function generateImage(prompt: string) {
  try {
    // Check if we're in development mode (no API key)
    if (!process.env.FALAI_API_KEY) {
      console.log("⚠️ DEVELOPMENT MODE: Using fallback images instead of FAL.ai API")
      console.log("To use the real API, set the FALAI_API_KEY environment variable")
      
      // Get a random fallback image
      const imageUrl = FALLBACK_IMAGE_URLS[Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length)]
      console.log(`Using fallback image URL: ${imageUrl}`)
      
      // Wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return imageUrl
    }

    console.log("Calling real FAL.ai API with prompt:", prompt.substring(0, 50) + "...")
    
    // Use the FALAI_MODEL_ID if available, otherwise use default model
    const modelId = process.env.FALAI_MODEL_ID || "fast-sdxl"
    
    const res = await fetch(`https://api.fal.ai/v1/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FALAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        input: { prompt },
      }),
    })

    if (!res.ok) {
      const errorData = await res.text()
      console.error("Fal.ai request failed:", errorData)
      throw new Error(`Fal.ai request failed: ${res.status}`)
    }

    const data = await res.json()
    return data.output.url as string
  } catch (error) {
    console.error("Error generating image with Fal.ai:", error)
    
    // Fallback to a random image if the API call fails
    const fallbackUrl = FALLBACK_IMAGE_URLS[Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length)]
    console.log(`Using fallback image URL: ${fallbackUrl}`)
    return fallbackUrl
  }
}
