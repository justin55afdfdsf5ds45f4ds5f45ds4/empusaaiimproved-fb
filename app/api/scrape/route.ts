import { NextResponse } from "next/server"
import { scrapeUrl } from "@/lib/firecrawl"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ 
        success: false,
        error: "URL is required" 
      }, { status: 400 })
    }

    console.log("Scraping URL:", url)

    // Scrape the URL using FireCrawl
    const scrapedData = await scrapeUrl(url)

    // Return the response with all relevant information
    return NextResponse.json({
      success: true,
      url: scrapedData.url,
      title: scrapedData.title,
      description: scrapedData.description,
      content: scrapedData.content,
      readable: scrapedData.readable,
      texts: scrapedData.texts,
      development_mode: !process.env.FireCrawl_API
    })

  } catch (error) {
    console.error("Error in scraping route:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 