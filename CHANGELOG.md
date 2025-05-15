# CHANGELOG

## Pinterest Integration & Auth Stabilization

### Pinterest OAuth & API
- Added Pinterest OAuth flow with required scopes (boards:read, pins:read, pins:write)
- Implemented token storage in MongoDB under the user's document
- Created server-side API routes:
  - POST /api/pinterest/connect - Initiates OAuth flow
  - GET /api/pinterest/callback - Handles redirect and token exchange
  - GET /api/pinterest/boards - Returns authenticated user's boards
  - POST /api/pinterest/pins - Creates new pins on Pinterest
  - GET /api/pinterest/status - Checks Pinterest connection status
  - POST /api/pinterest/disconnect - Removes Pinterest connection

### Code Restructuring
- Moved all API routes to /app/api/**
- Moved reusable helpers to /lib/**
- Organized type declarations in /types/**
- Removed dead code and unused imports
- Created a dedicated Pinterest helper library in /lib/pinterest.ts

### Login & Session Integrity
- Maintained NextAuth configuration with Google provider
- Enforced credential verification against MongoDB
- Added server-side checks in authentication routes
- Ensured session persistence in MongoDB

### UI Restoration
- Added settings pages:
  - /dashboard/settings - Main settings page
  - /dashboard/settings/profile - User profile settings
  - /dashboard/settings/social - Social connections management
- Updated navigation components to include new routes
- Ensured proper routing in both development and production

### Additional Improvements
- Added proper error handling throughout the application
- Implemented token refresh mechanism for Pinterest API
- Added user feedback with toast notifications
- Improved type safety with TypeScript interfaces
