import { JSDOM } from "jsdom"

export async function extractContentFromUrl(url: string): Promise<string> {
  try {
    console.log(`Extracting content from URL: ${url}`)

    // Handle Google redirect URLs
    if (url.includes("google.com/url") && url.includes("&url=")) {
      const match = url.match(/[&?]url=([^&]+)/)
      if (match && match[1]) {
        url = decodeURIComponent(match[1])
        console.log(`Extracted actual URL from Google redirect: ${url}`)
      }
    }

    // Fetch the content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()

    // Parse the HTML
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Remove script and style elements
    const scripts = document.querySelectorAll("script, style, noscript, iframe, svg")
    scripts.forEach((script) => script.remove())

    // Get the title
    const title = document.querySelector("title")?.textContent || ""

    // Get meta description
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || ""

    // Get main content
    let mainContent = ""

    // Try to find main content containers
    const contentSelectors = ["main", "article", "#content", ".content", "#main", ".main", ".post", ".article"]

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector)
      if (element && element.textContent && element.textContent.trim().length > 100) {
        mainContent = element.textContent
        break
      }
    }

    // If no main content found, use body
    if (!mainContent) {
      mainContent = document.body.textContent || ""
    }

    // Clean up the text
    const cleanText = mainContent.replace(/\s+/g, " ").trim()

    // Combine all the content
    const combinedContent = [`Title: ${title}`, `Description: ${metaDescription}`, `Content: ${cleanText}`].join("\n\n")

    console.log(`Successfully extracted content (${combinedContent.length} chars)`)

    return combinedContent
  } catch (error) {
    console.error("Error extracting content from URL:", error)
    return `Failed to extract content from URL: ${url}. Error: ${error instanceof Error ? error.message : String(error)}`
  }
}
