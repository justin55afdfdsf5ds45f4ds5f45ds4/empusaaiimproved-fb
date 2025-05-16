/**
 * FireCrawl API integration for web scraping
 */

// Sample dummy content for development mode (without API key)
const DUMMY_CONTENT = {
  url: "https://example.com/sample-article",
  title: "Sample Article Title for Development",
  description: "This is a sample description for development purposes when no FireCrawl API key is available.",
  content: `
    <h1>Sample Article Content</h1>
    <p>This is a placeholder for when the FireCrawl API is not available.</p>
    <p>In this sample article, we discuss various topics related to web content.</p>
    <p>To use the real scraping functionality, please set up your FireCrawl_API environment variable.</p>
    <h2>Section 1: Introduction</h2>
    <p>This is the introduction to our sample content.</p>
    <h2>Section 2: Main Content</h2>
    <p>This represents the main content area of a scraped article.</p>
    <p>In a real implementation, this would contain the actual content from the target URL.</p>
    <h2>Section 3: Conclusion</h2>
    <p>This is the conclusion of our sample content.</p>
  `,
  readable: "Sample Article Title for Development\n\nThis is a placeholder for when the FireCrawl API is not available. In this sample article, we discuss various topics related to web content. To use the real scraping functionality, please set up your FireCrawl_API environment variable.\n\nSection 1: Introduction\nThis is the introduction to our sample content.\n\nSection 2: Main Content\nThis represents the main content area of a scraped article. In a real implementation, this would contain the actual content from the target URL.\n\nSection 3: Conclusion\nThis is the conclusion of our sample content.",
  texts: [
    "Sample Article Title for Development",
    "This is a sample description for development purposes.",
    "This is a placeholder for when the FireCrawl API is not available.",
    "In this sample article, we discuss various topics related to web content.",
    "To use the real scraping functionality, please set up your FireCrawl_API environment variable.",
    "Section 1: Introduction",
    "This is the introduction to our sample content.",
    "Section 2: Main Content",
    "This represents the main content area of a scraped article.",
    "In a real implementation, this would contain the actual content from the target URL.",
    "Section 3: Conclusion",
    "This is the conclusion of our sample content."
  ]
};

export async function scrapeUrl(url: string) {
  try {
    // Check if we're in development mode (no FireCrawl API key)
    if (!process.env.FireCrawl_API) {
      console.log("⚠️ DEVELOPMENT MODE: Using dummy content instead of FireCrawl API")
      console.log("To use the real API, set the FireCrawl_API environment variable")
      
      // Wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        ...DUMMY_CONTENT,
        url: url, // Use the provided URL
      };
    }

    console.log("Calling FireCrawl API for URL:", url);
    
    // Make the actual API call to FireCrawl
    const response = await fetch("https://api.firecrawl.dev/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FireCrawl_API}`,
      },
      body: JSON.stringify({
        url: url,
        options: {
          extractTitle: true,
          extractDescription: true,
          extractText: true,
          extractHtml: true,
          respectRobotsTxt: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FireCrawl API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    return {
      url: url,
      title: data.title || "",
      description: data.description || "",
      content: data.html || "",
      readable: data.text || "",
      texts: data.textElements || []
    };
  } catch (error) {
    console.error("Error scraping URL with FireCrawl:", error);
    // Return dummy content as fallback
    return {
      ...DUMMY_CONTENT,
      url: url,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 