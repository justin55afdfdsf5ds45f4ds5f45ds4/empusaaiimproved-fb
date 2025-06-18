import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateFluxSchnellImage } from "@/lib/replicate"; // This will still generate the actual image
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Sample topics for generating content (kept as a fallback if no keywords are extracted)
const TOPICS = [
  "travel",
  "food",
  "fashion",
  "home decor",
  "fitness",
  "technology",
  "art",
  "beauty",
  "gardening",
  "diy",
];

// --- REMOVED: ADJECTIVES, ADJECTIVES_FOR_TITLES, VISUAL_STYLES, MOODS_AND_COLORS, COMPOSITIONS ---
// These lists are no longer needed here because the LLM will dynamically generate these elements
// based on the sophisticated prompts..

// Helper function to call Replicate's Llama-3 model with a system/user prompt structure
async function callLlama3(systemPrompt: string, userPrompt: string): Promise<string> {
    const fullPrompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n${userPrompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`;
    
    const output = await replicate.run("meta/meta-llama-3-8b-instruct", {
        input: {
            prompt: fullPrompt,
            max_new_tokens: 512, // Increased token limit for more detailed responses
            temperature: 0.7, // Slightly higher temperature for creativity, balance with 0.3 if needed
            top_p: 0.9,
        },
    });
    return (output as string[]).join("").trim();
}

// Function to generate a title using Llama-3 with advanced prompt engineering
async function generateTitle(keywords: string): Promise<string> {
    const systemPrompt = `You are a highly skilled Pinterest content creator and SEO expert. Your goal is to generate a compelling title for an image, specifically optimized to drive high traffic and virality on Pinterest. The title should be catchy, action-oriented, and include relevant keywords. You must output ONLY the title string, without any additional text or formatting.`;

    const userPrompt = `Generate a title based on these keywords: "${keywords}".
    
    Consider:
    - Incorporating high-traffic keywords.
    - Crafting a catchy, action-oriented title (e.g., "5 Ways to...", "How to Master...", "The Ultimate Guide to...").
    - Aim for conciseness and strong visual appeal in the text.
    - If appropriate, use numbers (e.g., "10 Best...", "7 Tips...").`;

    try {
        const title = await callLlama3(systemPrompt, userPrompt);
        return title.replace(/"/g, ''); // Remove any lingering quotes if the model outputs them
    } catch (error) {
        console.error("Error generating title with Llama-3:", error);
        // Fallback to a simpler, template-based title if LLM fails
        const primaryKeyword = keywords.split(',')[0]?.trim() || TOPICS[Math.floor(Math.random() * TOPICS.length)];
        return `Amazing ${primaryKeyword} Ideas for Your Next Project`;
    }
}

// Function to generate a description using Llama-3 with advanced prompt engineering
async function generateDescription(keywords: string): Promise<string> {
    const systemPrompt = `You are an expert Pinterest content strategist and copywriter. Your task is to generate a keyword-rich, engaging description for a Pinterest image. The description should be benefit-driven, encourage clicks and saves, and include relevant hashtags and a call-to-action. You must output ONLY the description string, without any additional text or formatting.`;

    const userPrompt = `Generate a description based on these keywords: "${keywords}".
    
    Consider:
    - Weaving in primary and secondary keywords naturally.
    - Highlighting benefits or solutions.
    - Adding relevant hashtags (e.g., #topicideas #diyprojects #trends).
    - Including a clear call-to-action (e.g., "Save this Pin!", "Click to learn more", "Link in bio!").
    - Keep it concise and impactful, ideally 2-4 sentences.`;

    try {
        const description = await callLlama3(systemPrompt, userPrompt);
        return description.replace(/"/g, ''); // Remove any lingering quotes
    } catch (error) {
        console.error("Error generating description with Llama-3:", error);
        // Fallback to a simpler, template-based description if LLM fails
        const primaryKeyword = keywords.split(',')[0]?.trim() || TOPICS[Math.floor(Math.random() * TOPICS.length)];
        return `Discover amazing ${primaryKeyword} ideas that will transform your approach. Save this pin for later!`;
    }
}

// Function to generate an image prompt using Llama-3 with advanced prompt engineering
async function generateImagePrompt(keywords: string): Promise<string> {
    const systemPrompt = `You are an AI image generation prompt expert, specializing in creating high-quality, visually stunning prompts for diffusion models like Stable Diffusion or Flux Schnell. Your task is to generate a single, vivid, and highly detailed image prompt based on the provided keywords. The prompt must be optimized for generating captivating and traffic-driving Pinterest-style images.
    
    Include:
    - **Main Subject & Key Elements:** Clearly describe the central focus and important objects.
    - **Artistic Style/Medium:** Specify a genre (e.g., photorealistic, digital painting, cinematic, watercolor).
    - **Lighting & Atmosphere:** Detail the lighting conditions (e.g., golden hour, dramatic shadows, soft natural light, studio lighting) and overall mood (e.g., vibrant, serene, mysterious).
    - **Composition & Perspective:** Suggest camera angles or framing (e.g., wide shot, close-up, rule of thirds, symmetrical, portrait orientation).
    - **Quality Enhancers:** Add terms known to boost AI image quality (e.g., "8k, ultra detailed, volumetric light, trending on Artstation, masterpiece, photorealistic, hyperrealistic, Unreal Engine, Octane render").
    - **Pinterest Aesthetic:** Incorporate words that evoke Pinterest appeal (e.g., "Pinterest worthy," "viral pin," "aesthetic," "clean composition").
    -"Pinterest style: tell it to add big text as an headline to grab the attention. should be minimalist but creative healdine text related to the topic given.

    
    Format: The output should be a single string, ready to be passed directly to an image generation model. Do NOT include any additional text, JSON, or formatting besides the prompt itself. Always append a negative prompt at the end using the '--neg' tag.`;

    const userPrompt = `Generate one detailed image prompt for a Pinterest post based on these keywords: "${keywords}".`;

    try {
        const generatedPrompt = await callLlama3(systemPrompt, userPrompt);
        // Ensure the negative prompt is always appended. If the LLM already included it, fine.
        // If not, add a standard one.
        const negativePrompt = "blurry, low resolution, bad anatomy, deformed, disfigured, poor lighting, text, watermark, signature, ugly, tiling, duplicate, worst quality, low quality, pixelated, error, out of frame, out of focus, noisy, cartoon, 3d, render, painting, drawing, cropped, distortion, surreal, abstract, over-saturated, mundane, boring";
        
        // Check if the generated prompt already contains a --neg part
        if (!generatedPrompt.includes("--neg")) {
            return `${generatedPrompt.replace(/"/g, '').trim()} --neg ${negativePrompt}`;
        }
        return generatedPrompt.replace(/"/g, '').trim(); // Just clean up quotes if present
    } catch (error) {
        console.error("Error generating image prompt with Llama-3:", error);
        // Fallback to a simpler, template-based image prompt if LLM fails
        const primaryKeyword = keywords.split(',')[0]?.trim() || TOPICS[Math.floor(Math.random() * TOPICS.length)];
        return `Beautiful ${primaryKeyword} photography with natural lighting, professional quality, trending on Pinterest --neg ${"blurry, low resolution, bad anatomy, deformed, disfigured, poor lighting"}`;
    }
}

// Function to extract keywords from URL or use provided topic (System Prompt Enhanced)
async function extractKeywords(
  url: string | null,
  topic: string | null
): Promise<string | null> {
  if (topic && topic.trim().length > 0) {
    return topic.trim().toLowerCase();
  }

  if (url) {
    try {
      if (!process.env.FIRECRAWL_API_KEY || !process.env.OPENAI_API_KEY) {
        console.log("Missing API keys for URL extraction, using fallback");
        return null;
      }

      if (!/^https?:\/\//.test(url)) throw new Error("Invalid URL");

      const [{ default: FirecrawlApp }, { OpenAI }] = await Promise.all([
        import("firecrawl"),
        import("openai"),
      ]);

      const firecrawl = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY,
      });
      // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Not directly used in this flow, but kept if you have other uses.

      console.log("🔎 Scraping page:", url);
      const raw = await firecrawl.scrapeUrl(url, { onlyMainContent: false });

      if (!raw.success) {
        throw new Error(raw.error);
      }

      const pageText = raw.metadata?.description || raw.data?.content || ""; // Fallback to content if description is empty

      if (!pageText.trim()) throw new Error("No usable content from Firecrawl");

      // --- IMPROVED SYSTEM PROMPT FOR KEYWORD EXTRACTION (FROM PREVIOUS ROUND) ---
      const sysPrompt = `You are an expert Pinterest content strategist and SEO specialist. Your task is to analyze webpage content and extract a diverse set of highly relevant, high-traffic keywords and short phrases. These keywords should be optimized for Pinterest search, aiming for virality and strong engagement.
Prioritize:
1. Long-tail keywords (e.g., "easy vegan dinner recipes for families").
2. Trending topics related to the content.
3. Action-oriented phrases (e.g., "how to master [topic]", "DIY [item]").
4. Keywords that evoke positive emotions or inspire action.
5. Specific nouns and adjectives that are visually descriptive.

Output a single string of comma-separated keywords and phrases, all lowercase, no paragraphs. Ensure the list is comprehensive yet concise, containing 5-15 highly impactful terms.`;
      // --- END IMPROVED SYSTEM PROMPT ---

      const userPrompt = pageText.slice(0, 8000); // Limit user prompt to 8000 characters
      
      const output = await callLlama3(sysPrompt, userPrompt);
      const textOutput = output; // callLlama3 already handles joining the string array and trimming
      console.log("🗝️ Extracted keywords:", textOutput);
      return textOutput;
    } catch (err: unknown) {
      console.error(
        "❌ Error extracting keywords:",
        err instanceof Error ? err.message : String(err)
      );
      return null;
    }
  }

  // Default to a random topic if no keywords could be extracted
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

// Fallback image URLs from Unsplash (kept as is)
const FALLBACK_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1511649475669-e288648b2339?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=1200&fit=crop",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, topic, count = 10, tone = "informative" } = body;

    console.log("Generating posts with:", { url, topic, count, tone });

    // Step 1: Extract keywords using Llama-3 with the improved prompt
    const extractedKeywords = await extractKeywords(url, topic);
    const keywordsToUse = extractedKeywords || TOPICS[Math.floor(Math.random() * TOPICS.length)]; // Ensure a string is always passed

    const requestedCount = count;

    const postPromises = Array.from({ length: requestedCount }).map(
      async () => {
        // Step 2: Generate title, description, and image prompt using Llama-3
        const titlePromise = generateTitle(keywordsToUse);
        const descriptionPromise = generateDescription(keywordsToUse);
        const imagePromptPromise = generateImagePrompt(keywordsToUse);

        const [title, description, imagePrompt] = await Promise.all([
          titlePromise,
          descriptionPromise,
          imagePromptPromise,
        ]);
        
        let imageUrl;

        try {
          imageUrl = await generateFluxSchnellImage(imagePrompt);
        } catch(error) {
          console.error("Error generating image from Replicate:", error);
          imageUrl =
            FALLBACK_IMAGE_URLS[
              Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length)
            ];
        }

        return {
          id: uuidv4(),
          title,
          description,
          imagePrompt, // Store the generated image prompt for logging/debugging
          imageUrl,
        };
      }
    );

    const posts = await Promise.all(postPromises);

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    posts.forEach(async (post) => {
      await db.collection("posts").insertOne({
        userId: user?._id,
        postId: post.id,
        title: post.title,
        description: post.description || "",
        imageUrl: post.imageUrl,
        createdAt: new Date(),
      });
    });

    console.log(`Generated ${posts.length} posts`);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error generating posts:", error);
    return NextResponse.json(
      {
        error: `Failed to generate posts: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
