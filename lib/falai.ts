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
    if (!process.env.FALAI_API_KEY) {
      throw new Error("FALAI_API_KEY is not set in environment variables")
    }

    console.log("Calling FAL.ai API with prompt:", prompt.substring(0, 50) + "...")
    
    // Use the FALAI_MODEL_ID if available, otherwise use default model
    const modelId = process.env.FALAI_MODEL_ID || "fast-sdxl"
    
    // Import node-fetch if in Node.js environment
    const fetchImpl = typeof window === 'undefined' ? 
      (await import('node-fetch')).default : 
      window.fetch;
    
    const res = await fetchImpl("https://110602490-fast-sdxl.gateway.alpha.fal.ai/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FALAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: "square_hd", // or "portrait_hd" / "landscape_hd"
        sync_mode: true
      }),
    })

    if (!res.ok) {
      const errorData = await res.text()
      console.error("Fal.ai request failed:", errorData)
      throw new Error(`Fal.ai request failed: ${res.status} - ${errorData}`)
    }

    const data = await res.json()
    
    // Handle the response based on Fal.ai's actual response format
    const imageUrl = data.images?.[0]?.url || data.image_url || data.output?.url
    
    if (!imageUrl) {
      throw new Error("No image URL in response")
    }
    
    return imageUrl
  } catch (error) {
    console.error("Error generating image with Fal.ai:", error)
    throw error // Re-throw the error instead of falling back to Unsplash
  }
}
