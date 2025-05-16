// Test script for image generation API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testImageGeneration() {
  try {
    console.log('===== Testing Image Generation API =====');
    
    // Test case 1: Basic landscape prompt
    await testPrompt('A beautiful mountain landscape with a lake');
    
    // Test case 2: Food-related prompt
    await testPrompt('Delicious healthy meal with fresh vegetables and grains');
    
    // Test case 3: Abstract/creative prompt
    await testPrompt('Vibrant abstract design with geometric patterns in blue and orange');
    
    // Test case 4: Pinterest-style prompt
    await testPrompt('Create an elegant minimalist infographic about sustainable living with soft earth tones --ar 2:3');
    
    console.log('\n✅ All tests completed!');
    console.log('NOTE: If you want to use the real Fal.ai API, create a .env.local file with your FALAI_API_KEY and OPENAI_API_KEY variables');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

async function testPrompt(prompt) {
  console.log(`\n----- Testing prompt: "${prompt}" -----`);
  
  try {
    const response = await fetch('http://localhost:3002/api/fal/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorData}`);
    }
    
    const data = await response.json();
    console.log('Response Status: ✅ SUCCESS');
    
    if (data.images && data.images[0] && data.images[0].url) {
      console.log('Image URL: ✅ FOUND -', data.images[0].url.substring(0, 60) + '...');
    } else {
      console.error('Image URL: ❌ MISSING');
    }
    
    // Check for development mode
    if (data.development_mode === true) {
      console.log('Mode: ⚠️ DEVELOPMENT (using fallback images)');
    } else if (data.development_mode === false) {
      console.log('Mode: ✅ PRODUCTION (using real Fal.ai API)');
    }
    
    // Check OpenAI integration
    if (data.enhanced_prompt && data.enhanced_prompt !== data.original_prompt) {
      console.log('OpenAI: ✅ WORKING - Enhanced prompt:');
      console.log(`  "${data.enhanced_prompt.substring(0, 100)}${data.enhanced_prompt.length > 100 ? '...' : ''}"`);
    } else if (data.enhanced_prompt) {
      console.log('OpenAI: ⚠️ ORIGINAL PROMPT USED (API key may be missing)');
    } else {
      console.log('OpenAI: ❌ NOT INTEGRATED (no enhanced_prompt field)');
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Test failed for prompt "${prompt}":`, error.message);
    return null;
  }
}

// Run the tests
testImageGeneration(); 