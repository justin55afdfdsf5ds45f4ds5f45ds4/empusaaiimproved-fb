# Image Generation API Setup Guide

This guide explains how to set up the image generation functionality in Empusa AI to work with real APIs instead of dummy data.

## Overview

Empusa AI uses two main APIs for image generation:

1. **Fal.ai** - For actual image generation
2. **OpenAI** - For enhancing prompts to get better image outputs (optional)

The system is designed to work in two modes:

- **Development Mode**: Uses fallback images from Unsplash when API keys are not configured
- **Production Mode**: Uses real API calls to Fal.ai and OpenAI (if configured)

## Environment Variables

The application uses the following environment variables:

- `FALAI_API_KEY` - Your Fal.ai API key
- `FALAI_MODEL_ID` - The Fal.ai model to use (default: "fast-sdxl")
- `OPENAI_API_KEY` - Your OpenAI API key (optional)
- `FireCrawl_API` - Your FireCrawl API key (for crawling/scraping functionality)

## Setting Up API Keys

### 1. Create or update your environment variables

These should be set in your environment or in a `.env.local` file in the project root:

```
# Fal.ai API Key (required for real image generation)
FALAI_API_KEY=your_fal_ai_key_here
FALAI_MODEL_ID=fast-sdxl

# OpenAI API Key (optional, used for prompt enhancement)
OPENAI_API_KEY=your_openai_api_key_here

# FireCrawl API Key (for crawling and scraping)
FireCrawl_API=your_firecrawl_api_key_here
```

### 2. Getting API Keys

#### Fal.ai API Key

1. Sign up or log in at [Fal.ai](https://www.fal.ai/)
2. Navigate to your dashboard
3. Go to API Keys section
4. Create a new API key or copy your existing key
5. Set it as the value for `FALAI_API_KEY` in your environment

#### OpenAI API Key (Optional)

1. Sign up or log in at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API keys section
3. Create a new secret key
4. Set it as the value for `OPENAI_API_KEY` in your environment

## Testing Your Setup

1. Start the development server:
   ```
   npm run dev
   ```

2. Run the test script to verify API integration:
   ```
   node test-image-api.js
   ```

3. Check the output to confirm:
   - If you see "Mode: ✅ PRODUCTION" - You're using real Fal.ai API
   - If you see "Mode: ⚠️ DEVELOPMENT" - You're using fallback images
   - If you see "OpenAI: ✅ WORKING" - Prompt enhancement is working

## Troubleshooting

### Common Issues

1. **Error: FALAI_API_KEY environment variable is not set**
   - Make sure your environment variables are correctly set
   - Verify your Fal.ai API key is correct
   - Restart the development server after making changes

2. **Error with OpenAI Integration**
   - The system will fall back to using the original prompts if OpenAI fails
   - Check that your OpenAI API key is valid and has sufficient credits

3. **Images Not Generating Properly**
   - Fal.ai might have rate limits on your account tier
   - Try more specific prompts for better results

## Additional Configuration

- You can change the model used by setting the `FALAI_MODEL_ID` environment variable
- Default model is "fast-sdxl" for quick generation
- Other options include "stable-diffusion-xl-v1-0" for higher quality (but slower) generation

## Pipeline Integration

Once correctly set up, the image generation will be used in these contexts:

1. When clicking the "Generate Image" button on posts
2. During the post generation process
3. As part of the content pipeline when processing URLs

For any additional help, please contact the development team. 