# Jasper AI Clone

A Pinterest content creation tool that uses AI to generate and publish content.

## Environment Variables

This application requires the following environment variables:

- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `PINTEREST_APP_ID`: Pinterest app ID
- `PINTEREST_APP_SECRET`: Pinterest app secret
- `NEXTAUTH_URL`: The base URL of your application
- `NEXTAUTH_SECRET`: A secret string used to encrypt session cookies
- `FALAI_API_KEY`: Fal.ai API key for image generation
- `FALAI_MODEL_ID`: Fal.ai model ID for image generation (defaults to "stable-diffusion-xl-v1-0" if not provided)
- `MONGODB_URI`: MongoDB connection string (optional)

## OAuth Redirect URIs

When setting up OAuth credentials in Google Cloud and Pinterest developer dashboards, use the following exact redirect URIs:

### Production

- Google: `https://v0-jasper-ai-clone-chi.vercel.app/api/auth/callback/google`
- Pinterest: `https://v0-jasper-ai-clone-chi.vercel.app/api/auth/callback/pinterest`

### Development

- Google: `http://localhost:3000/api/auth/callback/google`
- Pinterest: `http://localhost:3000/api/auth/callback/pinterest`

## Features

- Google and Pinterest authentication
- AI-powered content generation
- Image generation with Fal.ai
- Pinterest board integration
- Post scheduling and publishing

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Connect it to Vercel
3. Set up the required environment variables
4. Deploy

\`\`\`

Let's check if there are any other files that might be using the old FAL_AI environment variable:
