// Test script for all components: FireCrawl, OpenAI, and Fal.ai
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAllComponents() {
  try {
    console.log('===== Testing All Components =====\n');
    
    // Test Case 1: Basic URL scraping and image generation
    console.log('\n----- Test Case 1: Basic URL Scraping and Image Generation -----');
    const testUrl = 'https://api.firecrawl.com/scrape';
    
    // Step 1: Scrape URL
    console.log('\n1. Testing FireCrawl URL Scraping:');
    const scrapeResponse = await fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: testUrl }),
    });

    if (!scrapeResponse.ok) {
      throw new Error(`Scraping API request failed: ${scrapeResponse.status}`);
    }

    const scrapeData = await scrapeResponse.json();
    console.log('✓ Scraping Response:', scrapeData.success ? 'SUCCESS' : 'FAILED');
    console.log('✓ Title:', scrapeData.title);
    console.log('✓ Description:', scrapeData.description);

    // Step 2: Generate image from scraped content
    console.log('\n2. Testing Image Generation from Scraped Content:');
    const imageResponse = await fetch('http://localhost:3000/api/fal/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: `Create an image based on this content: ${scrapeData.description}` 
      }),
    });

    if (!imageResponse.ok) {
      throw new Error(`Image generation API request failed: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    console.log('✓ Image Generation Response:', imageData.success ? 'SUCCESS' : 'FAILED');
    console.log('✓ Original Prompt:', imageData.original_prompt);
    console.log('✓ Enhanced Prompt:', imageData.enhanced_prompt);
    console.log('✓ Image URL:', imageData.images?.[0]?.url ? 'GENERATED' : 'MISSING');

    // Test Case 2: Complex content processing
    console.log('\n----- Test Case 2: Complex Content Processing -----');
    const complexUrl = 'https://example.com/complex-article';
    
    // Step 1: Scrape complex URL
    console.log('\n1. Testing Complex URL Scraping:');
    const complexScrapeResponse = await fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: complexUrl }),
    });

    if (!complexScrapeResponse.ok) {
      throw new Error(`Complex scraping API request failed: ${complexScrapeResponse.status}`);
    }

    const complexScrapeData = await complexScrapeResponse.json();
    console.log('✓ Complex Scraping Response:', complexScrapeData.success ? 'SUCCESS' : 'FAILED');
    console.log('✓ Complex Title:', complexScrapeData.title);
    console.log('✓ Complex Description:', complexScrapeData.description);

    // Step 2: Generate multiple images from complex content
    console.log('\n2. Testing Multiple Image Generation:');
    const sections = complexScrapeData.texts.slice(0, 3); // Take first 3 sections
    
    for (const section of sections) {
      console.log(`\nGenerating image for section: "${section.substring(0, 50)}..."`);
      
      const sectionImageResponse = await fetch('http://localhost:3000/api/fal/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: section }),
      });

      if (!sectionImageResponse.ok) {
        console.error(`Failed to generate image for section: ${sectionImageResponse.status}`);
        continue;
      }

      const sectionImageData = await sectionImageResponse.json();
      console.log('✓ Section Image Generated:', sectionImageData.success ? 'SUCCESS' : 'FAILED');
      console.log('✓ Enhanced Prompt:', sectionImageData.enhanced_prompt);
      console.log('✓ Image URL:', sectionImageData.images?.[0]?.url ? 'GENERATED' : 'MISSING');
    }

    console.log('\n✅ All tests completed!');
    console.log('\nSummary:');
    console.log('- FireCrawl scraping is working:', scrapeData.success ? 'YES' : 'NO');
    console.log('- OpenAI prompt enhancement is working:', imageData.prompt_enhanced ? 'YES' : 'NO');
    console.log('- Fal.ai image generation is working:', imageData.images?.[0]?.url ? 'YES' : 'NO');
    
    if (!scrapeData.success || !imageData.prompt_enhanced || !imageData.images?.[0]?.url) {
      console.log('\n⚠️ Some components are not working properly. Please check:');
      if (!scrapeData.success) console.log('- FireCrawl API key and configuration');
      if (!imageData.prompt_enhanced) console.log('- OpenAI API key and configuration');
      if (!imageData.images?.[0]?.url) console.log('- Fal.ai API key and configuration');
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
console.log('Starting comprehensive tests...');
console.log('Make sure your development server is running on http://localhost:3000');
console.log('And ensure your .env.local file contains all necessary API keys:\n');
console.log('- FireCrawl_API');
console.log('- OPENAI_API_KEY');
console.log('- FALAI_API_KEY\n');

testAllComponents(); 