# Implementation Plan

- [x] 1. Create localStorage utility module
  - Create `src/utils/localStorage.ts` file with centralized authentication data management
  - Implement functions for storing, retrieving, and clearing authentication data
  - Modify `initiateGitHubAuth()` to use `window.location.href` instead of `window.open()`
  - Modify `initiateGoogleAuth()` to use `window.location.href` instead of `window.open()`
  - Remove localStorage management functions from authService
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 1.5, 1.6_

- [x] 2. Enhance Login component callback handling
  - Update `useEffect` to properly detect OAuth callbacks in same window
  - Implement provider detection logic from URL parameters
  - Add proper error handling for OAuth callback scenarios
  - Integrate new localStorage utility for token and user storage
  - Update `App.tsx` to import and use new localStorage utility
  - Update `ProtectedRoute.tsx` to use new authentication check
  - _Requirements: 1.7, 1.3, 1.4, 1.5, 1.6, 1.7, 3.1, 3.2, 4.1, 4.6_