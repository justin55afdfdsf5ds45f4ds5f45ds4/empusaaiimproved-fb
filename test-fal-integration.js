// Test script for Fal.ai and OpenAI integration
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testImageGeneration() {
  try {
    console.log('===== Testing Image Generation Pipeline =====\n');
    
    const testCases = [
      {
        name: "Basic Landscape",
        prompt: "A beautiful mountain landscape"
      },
      {
        name: "Technical Prompt",
        prompt: "Futuristic technology interface, holographic display"
      },
      {
        name: "Creative Abstract",
        prompt: "Abstract geometric patterns in vibrant colors"
      }
    ];

    for (const test of testCases) {
      console.log(`\n----- Test Case: ${test.name} -----`);
      console.log(`Original Prompt: "${test.prompt}"`);
      
      try {
        const response = await fetch('http://localhost:3000/api/fal/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: test.prompt }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('\nResponse Analysis:');
        console.log('✓ API Response:', response.status === 200 ? 'SUCCESS' : 'FAILED');
        console.log('✓ Original Prompt:', data.original_prompt);
        console.log('✓ Enhanced Prompt:', data.enhanced_prompt);
        console.log('✓ Prompt Enhanced:', data.prompt_enhanced ? 'YES' : 'NO');
        console.log('✓ Development Mode:', data.development_mode ? 'YES' : 'NO');
        console.log('✓ Image URL:', data.images?.[0]?.url ? 'GENERATED' : 'MISSING');
        
        if (data.images?.[0]?.url) {
          console.log('\nImage Details:');
          console.log('URL:', data.images[0].url);
          console.log('Dimensions:', `${data.images[0].width}x${data.images[0].height}`);
        }

      } catch (error) {
        console.error(`❌ Test case "${test.name}" failed:`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
console.log('Starting tests...');
console.log('Make sure your development server is running on http://localhost:3000');
console.log('And ensure your .env.local file contains the necessary API keys\n');

testImageGeneration(); 