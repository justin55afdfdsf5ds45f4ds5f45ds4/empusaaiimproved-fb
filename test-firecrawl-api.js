// Test script for FireCrawl integration
// Direct implementation rather than importing the TypeScript module

// Sample dummy content for development mode (without API key)
const DUMMY_CONTENT = {
  url: "https://example.com/sample-article",
  title: "Sample Article Title for Development",
  description: "This is a sample description for development purposes when no FireCrawl API key is available.",
  content: "<h1>Sample Article Content</h1><p>This is a placeholder for when the FireCrawl API is not available.</p>",
  readable: "Sample Article Title for Development\n\nThis is a placeholder for when the FireCrawl API is not available.",
  texts: ["Sample Article Title for Development", "This is a sample description for development purposes."]
};

async function scrapeUrl(url) {
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
    const { default: fetch } = await import('node-fetch');
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
      error: error?.message || "Unknown error"
    };
  }
}

async function testFireCrawl() {
  try {
    console.log('===== Testing FireCrawl API Integration =====');
    
    // Test URL
    const testUrl = 'https://example.com';
    console.log(`Testing URL: ${testUrl}`);
    
    const result = await scrapeUrl(testUrl);
    
    console.log('\n----- FireCrawl Results -----');
    console.log('URL:', result.url);
    console.log('Title:', result.title);
    console.log('Description:', result.description?.substring(0, 100) + (result.description?.length > 100 ? '...' : ''));
    console.log('Content length:', result.content?.length || 0, 'characters');
    console.log('Readable text excerpt:', result.readable?.substring(0, 100) + '...');
    console.log('Number of text elements:', result.texts?.length || 0);
    
    // Check if we're in development mode
    if (!process.env.FireCrawl_API) {
      console.log('\n⚠️ DEVELOPMENT MODE: Using dummy content instead of real FireCrawl API');
      console.log('To use the real API, set the FireCrawl_API environment variable');
    } else {
      console.log('\n✅ PRODUCTION MODE: Using real FireCrawl API');
    }
    
    if (result.error) {
      console.log('\n❌ Error encountered:', result.error);
    }
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testFireCrawl(); 