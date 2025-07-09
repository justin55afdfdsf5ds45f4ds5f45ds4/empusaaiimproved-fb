import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateIdeogramV2TurboImage } from "@/lib/replicate"; // This will still generate the actual image
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import Replicate from "replicate";
import { uploadImageBase64 } from "@/lib/cloudinary1";
import { isFreeTrialUser, getFreeTrialPostsUsed, incrementFreeTrialPosts, hasExhaustedFreeTrial, getFreeTrialLimit } from '@/lib/freeTrial';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Sample topics for generating g content (kept as a fallback if no keywords are extracted)
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

// Helper function to call Replicate's Llama-3 model with a system/user prompt structure
async function callLlama3(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const fullPrompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n${userPrompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`;

  const output = await replicate.run("openai/gpt-4o-mini", {
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
async function generateTitle(keywords: string, hint?: string): Promise<string> {
  const systemPrompt = `You are a highly skilled Pinterest content creator and SEO expert.

Your task is to write a **catchy, action-oriented, keyword-rich title** for a Pinterest image post.

🔒 RULES (always follow):
- Always include **powerful action words.
- Always make the title **clear, benefit-focused**, and **clickable** — it should create curiosity or promise a result.
- Always include **relevant keywords** that users are likely to search (SEO intent).
- Always make the title **unique** — never repeat or copy previous outputs, even if the topic is similar.
- Always keep the title between **5–12 words**, concise and easy to read.

🎯 GOAL:
Drive high Pinterest engagement (clicks, saves, shares) and perform well in search.

🚫 NEVER:
- Never include punctuation unless needed (no “!”, “.” unless essential).
- Never include hashtags, emojis, formatting, or extra notes.
- Never write generic, vague, or flat phrases.
- Never output anything except the **title string**.
- do not use the word "transform" at all.
- do not use the word "Unlock" at all.
- do not use the word "Shed" at all.
- do not use the word "Crush" at all.
- do not use the sign colon at all.
- do not use the sign comma at all.
- do not use the word "Embrace" at the start at all.
- do not use the word "Unleash " at the start at all.
- do not use the sign ":" colon at all i am repeatedly saying it so listen to it and follow.
- Get the information from the provided headlines and pick any of those to craft the title each time unique.
- You will always use the given titles and headlines as a title for the title big headline or title. use title from the given titles, just fetch and add 1 or two words of your own..
- You should not give "here is the title" phrases or any formal AI words like you're saying here is the thing you should not do that instead you should only provide the original title and nothing else of you saying anything.
- You should not say "Here is a catchy, action-oriented" or anything formal words, instruction from you that here is the title, you should only give the original title and not overlay text of you saying anything.

- do not use the phrase "Discover the ultimate guide" as a whole but you can use each letters without combining them.
- do not use the phrase "Discover the power" as a whole but you can use each letters without combining them.
- do not use the phrase "Get ready to be inspired!" as a whole but you can use each letters without combining them.
- do not use the phrase "Discover the secret to" as a whole but you can use each letters without combining them.
- do not use the phrase "Learn the secrets" as a whole but you can use each letters without combining them.
- do not use the phrase "Fuel Your Body" as a whole but you can use each letters without combining them.
Only output the final **title string** — no explanation, no formatting.
don't make the title too long that you need comma to support the phrase because you should never use comma
don't use colan at all in the title, we are not using colan at all

.`;

  let userPrompt = `Generate one title like if it was written by a human based on this relevent information: "${keywords}".`;
  if (hint) {
    userPrompt += `\n\n${hint}`; // Prepend hint to user prompt
  }
  userPrompt += `\n\n" "`;

  try {
    const title = await callLlama3(systemPrompt, userPrompt);
    return cleanLLMOutput(title.replace(/"/g, "")); // Clean LLM tokens and stars
  } catch (error) {
    console.error("Error generating title with Llama-3:", error);
    // Fallback to a simpler, template-based title if LLM fails
    const primaryKeyword =
      keywords.split(",")[0]?.trim() ||
      TOPICS[Math.floor(Math.random() * TOPICS.length)];
    return ` ${primaryKeyword} `;
  }
}

// Function to generate a description using Llama-3 with advanced prompt engineering
async function generateDescription(keywords: string, hint?: string): Promise<string> {
  const systemPrompt = `You are an expert Pinterest content strategist and copywriter.

Your task is to write a **concise, engaging, keyword-rich description** for a Pinterest post based on a given title and image topic.

🔒 RULES (always follow):
- Always **repeat key phrases** from the title in the description (especially the core benefit and action keywords).
- Always **highlight the main benefit** clearly — what the viewer will learn or gain.
- Always write in a **human, minimal, and conversational tone** — no robotic language.
- Always make each description **unique** — never repeat the same wording or phrasing across prompts.
- Always include a **soft call to action** (e.g., “Try it now,” “Read more,” “Save this pin”).
- Always include **1–3 relevant hashtags** at the end (e.g., #weightloss #fitness #healthyliving).
- Always keep the description **easy to scan**, **clean**, and **not more than 3–4 lines**.

🚫 NEVER:
- Never add extra formatting (no bullets, no bold, no markdown).
- Never write off-topic or include information not related to the title.
- Never use clickbait or false promises.
- Never start with “This post…” or similar meta language.
- do not use the word "transform" at all.
- do not use the word "Shed" at all.
- do not use the word "Join Me" at all.
- do not use the word "Crush" at all.
- do not use the word "Unlock" at all.
- do not use the word "Embrace" at the start at all.
- do not use the word "Unleash " at the start at all.
- i am kept repeating to not give any overlay text like "Here is a concise, engaging, and keyword-rich description:" only give the description itself.
- You should not say "Here is a catchy, action-oriented" or anything formal words, instruction from you that here is the description, you should only give the original description and not overlay text of you saying anything.
- You should not give "here is the description" phrases or any formal AI words like you're saying here is the thing you should not do that instead you should only provide the original description and nothing else of you saying anything.
- You will always use the given titles and headlines as a consice information for the description big headline or title. use information from the given titles.
- Get the information from the provided headlines and pick any of those to craft the description each time unique.


- do not use the sign comma at all.
- do not use the word "Unlock" at in the start.
- do not use the sign colon at all.
- do not use the sign ":" colon at all.
- do not use the phrase "Unlock the Power" at all in the start"
- do not use the phrase "Get ready to" as a whole but you can use each letters without combining them.
- do not use the phrase "Discover the ultimate guide" as a whole but you can use each letters without combining them.
- do not use the word "Discover" at the start of the description, but you are feel free to use anywhere but at the start.
- do not use the word "Unlock" at the start of the description at all, you should know that to never use the word at the start
- do not use the phrase "Fuel Your Body" as a whole but you can use each letters without combining them.

Only output the **final description string**, nothing else.`;

  let userPrompt = `Generate one description like if it was written by a human based on this relevent information: "${keywords}".`;
  if (hint) {
    userPrompt += `\n\nAvoid these descriptions: ${hint}`;
    userPrompt += `\n\n${hint}`; // Prepend hint to user prompt
  }
  userPrompt += `\n\n" "`;

  try {
    const description = await callLlama3(systemPrompt, userPrompt);
    return cleanLLMOutput(description.replace(/"/g, "")); // Clean LLM tokens and stars
  } catch (error) {
    console.error("Error generating description with Llama-3:", error);
    // Fallback to a simpler, template-based description if LLM fails
    const primaryKeyword =
      keywords.split(",")[0]?.trim() ||
      TOPICS[Math.floor(Math.random() * TOPICS.length)];
    return ` ${primaryKeyword} `;
  }
}

// Function to generate an image prompt using Llama-3 with advanced prompt engineering
async function generateImagePrompt(keywords: string): Promise<string> {
  const systemPrompt = `You are an expert Pinterest image prompt creator. Your job is to write a single-line prompt for a text-to-image AI model like ideogram-v2-turbo. The image should be a vertical Pinterest-style poster with the following qualities:

- Always use headline text that you will use from keywords that will be provided to you, so in prompt always say to the model to use that headline with 5-6 eye catching words in the top in a creative yet minimalist way
- The prompt must include a minimal visual layout: one clean central subject, soft or solid background, centered composition
- The overall design should be simple, modern, and scroll-stopping — no clutter, no complexity, no over-detailing
- Use flat illustration, digital vector style, or futuristic clean visuals
- The layout should always be vertical (2:3 ratio), like a Pinterest pin
- Do not include fonts, color codes, or layout instructions — only describe the look and feel
- Always mention that this prompt is for pinterest post
- do not use any trademark logos or name.
- So do not use too much long image headline/title that will be in the image, make them short as possible but informative.
- Do not include fonts, color codes, or layout instructions — only describe the look and feel
- Always mention that this prompt is for pinterest post
- do not use any trademark logos or name.
- do not include any formal or overlay text like these - "Here is a Pinterest image prompt for the given keywords, Here is a Pinterest image prompt for the given keywords:" instead just give the final prompt
- always look into keywords and the information provided to you so you can craft the best prompt and always feature the core words as eye catching 5-6 words headline
- Always say in the prompt that is should be minimalist and creative with text so it can become eye catching image
- the 5-6 words of headline should be minimalist but it's text should be bold and eye catching, creative.
- when you give headline in the prompt as specefic to put in the image then give in "" so it can distinct and understood by the image gen model
-✅ Always put a **bold, headline-style text** at the top or center of the image. 
  → This must be short, clear (7–8 words max), and exactly what the image is about. 

- ✅ Always put a **single centered subject** — either a photo or illustration — that directly supports the text. 

- ✅ Always put a **clean, minimalist layout** with **soft, solid, or gradient background** (no clutter, no harsh contrast, no busy textures).

- ✅ Always put the image in a **2:3 vertical Pinterest format**, optimized for mobile viewing.

- ✅ Always put a **scroll-stopping aesthetic** with high readability, bold composition, and realistic design quality (well-lit, sharp subject, no distortion or cartoonish elements).

- ✅ Always keep the style **modern, flat, or vector**, unless realism is requested by the topic.
- ✅ Always put a 7-8 headline from related keywords in the image in an creative way.
- ✅ Always use the headline from the data provided to you and use headline as a top of the image headline
- ✅ You are a very greedy salesman that always only reads information and generate prompt that will result in a image that tells the people about just making them click somehow by indirectly using the best headlines and eye catching phrases to attract them and make them click the image 
- You will always use the given titles and headlines as a title for the image big headline or title. use information from the given titles.
Only output 4 line of prompt. No explanation. No formatting.`;

  const userPrompt = `Generate one image prompt for a Pinterest post based on these keywords: "${keywords}".`;

  try {
    const generatedPrompt = await callLlama3(systemPrompt, userPrompt);
    // Ensure the negative prompt is always appended. If the LLM already included it, fine.
    // If not, add a standard one.
    const negativePrompt =
      " ";

    // Check if the generated prompt already contains a --neg part
    if (!generatedPrompt.includes("--neg")) {
      return `${generatedPrompt
        .replace(/"/g, "")
        .trim()} --neg ${negativePrompt}`;
    }
    return generatedPrompt.replace(/"/g, "").trim(); // Just clean up quotes if present
  } catch (error) {
    console.error("Error generating image prompt with Llama-3:", error);
    // Fallback to a simpler, template-based image prompt if LLM fails
    const primaryKeyword =
      keywords.split(",")[0]?.trim() ||
      TOPICS[Math.floor(Math.random() * TOPICS.length)];
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
      const sysPrompt = `you are a greedy salesman that exctract headline of the information in the webpage and always provide the headline first and then a summery of what the page is all about and nothing else and you keep the output in only 800 words. and always make sure you give a headline tag and then tell what is the headline of the page specifically. always present the big headings of the page first that are in bold big letters and the heading 1 the big headings the title of the page. you are a salesman that always wants the visitor to visit the page you extract and that's why you always need to give the other salesman the information about the page in a way so he can craft the best marketing to market the site to get traffic, you never miss any key information that can result in a mislead information about the what the webpage is all about. your job is the first is always to first extract the first heading of the page no matter what you always extract that first the big first heading the main heading, you need to always make sure that you give 15-20 big headlines of what the blog is blog and each should be distinct from each other because you are a greedy salesman and you don't want anyone to see that one boring headline each time and that's why you not only get that big headline but also it's content to generate headlines of the base content inside the webpage and you always do this because you are the best salesman in the world so you never miss anything, your mission is to list out 15-20 headlines title that you extract from the webpage even if you don't find any big headlines to make up 15-20 headlines you always make sure you get the data from the body content and make up some 15-20 headlines from that instead`;
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

// Utility to clean LLM output (removes special tokens and Markdown stars)
function cleanLLMOutput(text: string): string {
  // Remove LLM special tokens like <|eot_id|>, <|begin_of_text|>, etc.
  let cleaned = text.replace(/<\|.*?\|>/g, '');
  // Remove leading/trailing stars and whitespace
  cleaned = cleaned.replace(/^\*+|\*+$/g, '').trim();
  return cleaned;
}

export async function POST(req: Request) {
  // Dynamically import sharp and node-fetch inside the handler
  const sharp = (await import("sharp")).default;
  const fetch = (await import("node-fetch")).default;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await req.json();
    // Free trial enforcement
    if (await isFreeTrialUser(userId)) {
      const used = await getFreeTrialPostsUsed(userId);
      const limit = getFreeTrialLimit();
      const requestedCount = body.count || 1;
      if (used >= limit) {
        return NextResponse.json({
          error: 'You have exhausted your free trial credits. Book a call here to work with us.',
          bookingLink: 'https://cal.com/justin-lord-a80mr6/30min',
        }, { status: 403 });
      }
      if (used + requestedCount > limit) {
        return NextResponse.json({
          error: `You only have ${limit - used} free trial post${limit - used === 1 ? '' : 's'} left.`,
          bookingLink: 'https://cal.com/justin-lord-a80mr6/30min',
        }, { status: 403 });
      }
    }
    const { url, topic, tone = "informative", count = 2, boardId } = body;

    console.log("Generating posts with:", { url, topic, count, tone });

    // Step 1: Extract keywords using Llama-3 with the improved prompt
    const extractedKeywords = await extractKeywords(url, topic);
    const keywordsToUse =
      extractedKeywords || TOPICS[Math.floor(Math.random() * TOPICS.length)]; // Ensure a string is always passed

    const requestedCount = count;

    // Sets to track uniqueness
    const usedTitles: Set<string> = new Set();
    const usedDescriptions: Set<string> = new Set();

    async function getUniqueValue(generateFn: (hint?: string) => Promise<string>, usedSet: Set<string>, type: string, maxRetries = 5) {
      let value = await generateFn();
      let retries = 0;
      while (usedSet.has(value) && retries < maxRetries) {
       // Stronger hint, placed at the start
        const hint = `IMPORTANT: Do NOT repeat or use any of these ${type}s: [${[...usedSet].join('; ')}]. Generate a completely new, unique ${type} that is different from all of them.`;
        value = await generateFn(hint);
        retries++;
      }
      usedSet.add(value);
      return value;
    }

    const postPromises = Array.from({ length: requestedCount }).map(
      async () => {
        // Step 2: Generate title, description, and image prompt using Llama-3
        const title = await generateTitle(keywordsToUse);
        const description = await generateDescription(keywordsToUse);
        const imagePrompt = await generateImagePrompt(keywordsToUse);

        let imageUrl;
        let cloudinaryUrl = null;
        let cloudinaryPublicId = null;
        try {
          imageUrl = await generateIdeogramV2TurboImage(imagePrompt, false); // get direct URL
          // Download image and convert to base64
          const imageResponse = await fetch(imageUrl);
          const buffer = await imageResponse.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const base64String = `data:image/jpeg;base64,${base64}`;
          // Upload to Cloudinary
          const uploadResult = await uploadImageBase64(base64String, 'pinterest');
          cloudinaryUrl = uploadResult.url;
          cloudinaryPublicId = uploadResult.public_id;

          // Store Cloudinary image info in DB for deletion automation
          try {
            const client = await clientPromise;
            const db = client.db();
            await db.collection('cloudinary_images').insertOne({
              public_id: cloudinaryPublicId,
              createdAt: new Date(),
              deleted: false,
            });
          } catch (dbErr) {
            console.error('Failed to record Cloudinary image in DB:', dbErr);
          }
          // TODO: Schedule deletion of this image from Cloudinary after 4 hours
          
        } catch (error) {
          console.error("Error generating or uploading image:", error);
          imageUrl =
            FALLBACK_IMAGE_URLS[
              Math.floor(Math.random() * FALLBACK_IMAGE_URLS.length)
            ];
          cloudinaryUrl = imageUrl;
        }

        return {
          id: uuidv4(),
          title,
          description,
          imagePrompt, // Store the generated image prompt for logging/debugging
          imageUrl: cloudinaryUrl,
          cloudinaryPublicId,
        };
      }
    );

    let posts = await Promise.all(postPromises);

    // Uniqueness enforcement after generation
    const maxRetries = 5;
    let retry = 0;
    while (retry < maxRetries) {
      let titles = posts.map(p => p.title);
      let descriptions = posts.map(p => p.description);
      let titleSet = new Set();
      let descSet = new Set();
      let duplicateTitleIndexes: number[] = [];
      let duplicateDescIndexes: number[] = [];
      titles.forEach((t, i) => {
        if (titleSet.has(t)) duplicateTitleIndexes.push(i);
        else titleSet.add(t);
      });
      descriptions.forEach((d, i) => {
        if (descSet.has(d)) duplicateDescIndexes.push(i);
        else descSet.add(d);
      });
      if (duplicateTitleIndexes.length === 0 && duplicateDescIndexes.length === 0) break;
      // Regenerate duplicates
      for (const i of duplicateTitleIndexes) {
        const usedTitles = posts.map(p => p.title);
        posts[i].title = await generateTitle(keywordsToUse, `Here are all the titles already used: [${usedTitles.join('; ')}]. Generate a new, unique title that is not in this list.`);
      }
      for (const i of duplicateDescIndexes) {
        const usedDescs = posts.map(p => p.description);
        posts[i].description = await generateDescription(keywordsToUse, `Here are all the descriptions already used: [${usedDescs.join('; ')}]. Generate a new, unique description that is not in this list.`);
      }
      retry++;
    }

    // After successful generation, increment free trial usage
    if (await isFreeTrialUser(userId)) {
      for (let i = 0; i < posts.length; i++) {
        await incrementFreeTrialPosts(userId);
      }
    }

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
