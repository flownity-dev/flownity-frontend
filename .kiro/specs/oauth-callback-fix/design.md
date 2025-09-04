# Design Document

## Overview

This design addresses the OAuth callback handling issues for both GitHub and Google authentication. The current implementation opens OAuth providers in new tabs and fails to properly handle the callback, preventing token storage and dashboard redirection. The solution will modify the authentication flow to use the same window and implement proper callback handling.

## Architecture

The OAuth flow will follow this simplified pattern:

1. **Initiation**: User clicks login button → Same window redirects to OAuth provider
2. **Authorization**: User authorizes on provider → Provider redirects back with code
3. **Callback**: Frontend detects callback → Extracts code → Calls backend
4. **Completion**: Backend returns token → Store in localStorage → Redirect to dashboard

## Components and Interfaces

### Modified Components

#### `authService.ts`
- **Change**: `initiateGitHubAuth()` and `initiateGoogleAuth()` will use `window.location.href` instead of `window.open()`
- **Change**: Remove localStorage handling functions (moved to separate utility)
- **Purpose**: Focus on API communication only

#### `Login.tsx`
- **Change**: Enhanced `useEffect` callback handling to properly detect and process OAuth callbacks
- **Change**: Use new localStorage utility for token and user storage
- **Purpose**: Improve callback detection and error handling
- **Key Logic**: 
  - Detect callback by checking for `code` parameter in URL
  - Determine provider from URL path or parameter
  - Handle both success and error scenarios

### New Components

#### `utils/localStorage.ts`
- **Purpose**: Centralized localStorage management for authentication data
- **Functions**: 
  - `storeAuthData(token, user)`: Store authentication token and user data
  - `getAuthToken()`: Retrieve stored authentication token
  - `getAuthUser()`: Retrieve stored user data
  - `clearAuthData()`: Clear all authentication data
  - `isAuthenticated()`: Check if user is authenticated

### URL Structure

The OAuth callback will be handled through URL parameters:
- Success: `http://localhost:5173/login?code=AUTH_CODE&state=STATE_VALUE`
- Error: `http://localhost:5173/login?error=access_denied&error_description=...`

## Data Models

### AuthCallbackResponse (existing)
```typescript
interface AuthCallbackResponse {
    success: boolean;
    message: string;
    token: string;
    user: Record<string, unknown>;
}
```

### URL Parameters
- `code`: Authorization code from OAuth provider
- `state`: Security state parameter
- `error`: Error code if authorization failed
- `error_description`: Human-readable error description

## Error Handling

### Client-Side Error Scenarios
1. **OAuth Denial**: User denies authorization → Display error message
2. **Network Errors**: API call fails → Display retry option
3. **Invalid Response**: Backend returns invalid data → Display generic error
4. **Missing Parameters**: Callback URL missing required parameters → Display error

### Error Display Strategy
- Use existing `Alert` component in Login.tsx
- Clear error state when user retries authentication
- Provide user-friendly error messages



## Implementation Notes

### Key Changes Required
1. **authService.ts**: Replace `window.open()` with `window.location.href` for both providers and remove localStorage functions
2. **utils/localStorage.ts**: Create new utility file for localStorage management
3. **Login.tsx**: Enhance callback detection logic and use new localStorage utility
4. **URL Handling**: Ensure callback URLs are properly parsed and cleaned up

### Security Considerations
- State parameter validation (if provided by backend)
- Token storage in localStorage (existing pattern)
- URL parameter cleanup after processing

### Browser Compatibility
- Standard `window.location.href` works across all modern browsers
- `URLSearchParams` API used for parameter parsing (widely supported)