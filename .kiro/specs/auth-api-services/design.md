# Design Document

## Overview

The authentication API services module will provide a clean, centralized interface for making HTTP requests to the backend authentication endpoints. The module will use axios for HTTP communication and follow the existing project patterns established in `src/http-common.ts`. The service will be implemented as a TypeScript module with individual functions for each authentication endpoint.

## Architecture

### Service Structure
```
src/services/
└── authService.ts    # Main authentication service module
```

The service will follow a functional approach with individual exported functions for each authentication endpoint, maintaining simplicity and avoiding unnecessary abstractions.

### HTTP Client Configuration
- Create a dedicated axios instance for authentication endpoints
- Base URL: `http://localhost:3000/auth`
- Content-Type: `application/json` (consistent with existing http-common.ts)
- Leverage existing axios dependency (version 1.11.0)

## Components and Interfaces

### AuthService Module (`src/services/authService.ts`)

#### Axios Instance
```typescript
const authApi = axios.create({
  baseURL: 'http://localhost:3000/auth',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### Service Functions

1. **GitHub OAuth Initiation**
   - Function: `initiateGitHubAuth()`
   - Method: Redirect to GET `/github`
   - Returns: void (performs redirect)

2. **GitHub OAuth Callback**
   - Function: `handleGitHubCallback()`
   - Method: GET `/github/callback`
   - Returns: Promise<AuthCallbackResponse>

3. **Google OAuth Initiation**
   - Function: `initiateGoogleAuth()`
   - Method: Redirect to GET `/google`
   - Returns: void (performs redirect)

4. **Google OAuth Callback**
   - Function: `handleGoogleCallback()`
   - Method: GET `/google/callback`
   - Returns: Promise<AuthCallbackResponse>

5. **Logout**
   - Function: `logout()`
   - Method: POST `/logout`
   - Returns: Promise with logout response

6. **Token Refresh**
   - Function: `refreshToken()`
   - Method: POST `/refresh`
   - Returns: Promise with new token data

## Data Models

### Response Types
```typescript
// Basic API response structure
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

// Authentication callback response (for both GitHub and Google)
interface AuthCallbackResponse {
  success: boolean;
  message: string;
  token: string;
  user: any;
}

// Logout response
interface LogoutResponse {
  success: boolean;
  message?: string;
}

// Token refresh response
interface RefreshResponse {
  success: boolean;
  message: string;
  token: string;
}
```

## Error Handling

### Error Propagation Strategy
- Let axios errors bubble up to calling components
- No custom error transformation or handling within the service
- Maintain simplicity by allowing components to handle errors as needed
- Leverage axios built-in error handling and response interceptors if needed in the future

### HTTP Status Handling
- 2xx responses: Return successful response data
- 4xx/5xx responses: Allow axios to throw errors naturally
- Network errors: Allow axios to handle connection issues



## Implementation Notes

### OAuth Flow Considerations
- OAuth initiation functions will use `window.location.href` for redirects
- Callback functions may need to extract query parameters or handle redirects
- The actual OAuth flow completion will depend on backend implementation details

### Integration Points
- Service will be imported into existing authentication components (Login.tsx)
- Functions can be called from React components using standard async/await patterns
- No state management integration required - components handle their own state

### File Organization
- Single service file to maintain simplicity
- Export individual functions rather than a class-based approach
- Follow existing project TypeScript and ESLint configurations