import { NextResponse } from "next/server"
import OpenAI from "openai"
import { generateImage } from "@/lib/falai"

// Sample image URLs from Unsplash for different categories (FALLBACK MODE)
const FALLBACK_IMAGE_URLS = {
  landscape: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=1200&fit=crop",
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=1200&fit=crop",
  ],
  general: [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=1200&fit=crop",
    "https://images.unsplash.com/photo-1507908708918-778587c9e563?w=800&h=1200&fit=crop",
  ]
}

// Function to determine fallback category (FALLBACK MODE)
function determineFallbackCategory(prompt: string): string {
  prompt = prompt.toLowerCase()
  
  if (prompt.includes("landscape") || prompt.includes("nature") || prompt.includes("mountain")) {
    return "landscape"
  }
  
  if (prompt.includes("food") || prompt.includes("meal") || prompt.includes("dish")) {
    return "food"
  }
  
  return "general"
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to enhance prompt with OpenAI
async function enhancePrompt(userPrompt: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found, using original prompt")
      return {
        success: true,
        prompt: userPrompt,
        enhanced: false
      }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert at creating detailed image generation prompts. Transform basic prompts into detailed ones optimized for Stable Diffusion XL.
Key points to include:
- Detailed visual descriptions
- Lighting and atmosphere
- Style and artistic direction
- Technical aspects (high resolution, detailed, sharp focus, etc.)
Keep the enhanced prompt concise but descriptive.`
        },
        {
          role: "user",
          content: `Transform this prompt for optimal image generation: "${userPrompt}". 
Include specific details about style, lighting, and quality but keep it under 100 words.`
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    const enhancedPrompt = response.choices[0]?.message?.content?.trim()
    
    if (!enhancedPrompt) {
      return {
        success: true,
        prompt: userPrompt,
        enhanced: false
      }
    }

    console.log("Enhanced prompt:", enhancedPrompt)
    return {
      success: true,
      prompt: enhancedPrompt,
      enhanced: true
    }
  } catch (error) {
    console.error("Error enhancing prompt with OpenAI:", error)
    return {
      success: false,
      prompt: userPrompt,
      enhanced: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Original prompt:", prompt)

    // Enhance the prompt using OpenAI
    const enhancedPromptResult = await enhancePrompt(prompt)
    const finalPrompt = enhancedPromptResult.prompt

    // Generate the image using the enhanced prompt
    const imageUrl = await generateImage(finalPrompt)

    // Return the response with all relevant information
    return NextResponse.json({
      success: true,
      images: [{
        url: imageUrl,
        width: 1024,
        height: 1024
      }],
      original_prompt: prompt,
      enhanced_prompt: finalPrompt,
      prompt_enhanced: enhancedPromptResult.enhanced
    })

  } catch (error) {
    console.error("Error in image generation route:", error)
    
    // Return a proper error response
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
