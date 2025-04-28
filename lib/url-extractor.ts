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

    // For now, return a placeholder response to bypass any potential issues
    return `This is placeholder content extracted from ${url}. In a production environment, 
    we would fetch and parse the actual content from the URL. The content would typically 
    include text, images, and other elements from the webpage.`
  } catch (error) {
    console.error("Error extracting content from URL:", error)
    return `Failed to extract content from URL: ${url}. Error: ${error instanceof Error ? error.message : String(error)}`
  }
}
