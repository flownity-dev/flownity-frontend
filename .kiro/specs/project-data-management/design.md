# Design Document

## Overview

This design implements the data management layer for project fetching and creation functionality in the existing Flownity React application. The implementation will integrate with the existing projectService.ts API layer and replace static sample data in the Projects component with real API calls. The design focuses on state management, error handling, and seamless integration with existing UI components.

## Architecture

### Data Flow Architecture
```
Projects Component
    ↓
React State (projects, loading, error)
    ↓
Custom Hooks (useProjects, useProjectCreation)
    ↓
Project Service Layer (existing)
    ↓
HTTP Client (existing)
    ↓
Backend API
```

### State Management Pattern
- Use React hooks (useState, useEffect) for local component state
- Custom hooks for reusable data fetching logic
- No external state management library needed for this scope
- Error boundaries for graceful error handling

## Components and Interfaces

### Modified Projects Component
The existing Projects component will be updated to:
- Completely remove all static sample data (sampleProjects, sampleData.ts)
- Integrate with project data fetching hooks for real API data
- Handle loading and error states for real API calls
- Maintain existing UI structure, but replace client-side filtering/pagination with backend pagination
- Update CreateProjectModal integration for real project creation

### Custom Hooks

#### useProjects Hook
```typescript
interface UseProjectsParams {
  page?: number;
  limit?: number;
  filter?: 'all' | 'archived';
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  refetch: () => void;
}

const useProjects = (params: UseProjectsParams): UseProjectsReturn
```

#### useProjectCreation Hook
```typescript
interface UseProjectCreationReturn {
  createProject: (data: CreateProjectFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useProjectCreation = (onSuccess?: (project: Project) => void): UseProjectCreationReturn
```

### State Interfaces
```typescript
interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

interface ProjectCreationState {
  loading: boolean;
  error: string | null;
}

interface PaginationParams {
  page: number;
  limit: number;
}
```

## Data Models

### Existing Types (from common.types.ts)
- `Project` - Core project interface
- `CreateProjectFormData` - Form data for project creation
- `ProjectStatus` - Project status enumeration

### API Response Handling
- Use existing projectService.getAllProjects() with pagination parameters
- Handle paginated API responses with metadata (totalPages, currentPage)
- Update projectService to accept pagination parameters: `page` (1-based) and `limit` (1-100, default 20)
- Maintain compatibility with existing Project interface
- Handle backend pagination instead of client-side pagination

## Error Handling

### Error Types
1. **Network Errors** - Connection issues, timeouts
2. **Authentication Errors** - Handled by existing HTTP interceptor
3. **Validation Errors** - Server-side validation failures
4. **Server Errors** - 5xx status codes

### Error Handling Strategy
```typescript
interface ErrorState {
  message: string;
  type: 'network' | 'validation' | 'server' | 'unknown';
  retryable: boolean;
}
```

### Error Recovery
- Automatic retry for network errors (with exponential backoff)
- Manual retry option for users
- Graceful degradation to previous state
- Clear error messages for user feedback

## Implementation Strategy

### Phase 1: Update Project Service for Pagination
1. Modify getAllProjects function to accept pagination parameters
2. Update function signature to include page and limit options
3. Ensure backward compatibility with existing calls

### Phase 2: Data Fetching Integration
1. Create useProjects custom hook with pagination support
2. Integrate hook into Projects component
3. Completely remove static sampleProjects import and sampleData.ts file
4. Replace all static data with real API calls
5. Update pagination logic to use backend pagination
6. Remove all client-side filtering and pagination logic

### Phase 3: Project Creation Integration
1. Create useProjectCreation custom hook
2. Integrate hook into existing CreateProjectModal
3. Update handleCreateProject function for real API calls
4. Add success/error feedback and proper state updates
5. Refresh projects list after successful creation

### Phase 4: State Synchronization
1. Ensure projects list updates after creation
2. Handle proper pagination state after project creation
3. Implement proper cleanup for component unmounting
4. Add request cancellation for pending requests



## Performance Considerations

### Optimization Strategies
1. **Request Deduplication** - Prevent duplicate API calls
2. **Caching** - Cache project data for short periods
3. **Lazy Loading** - Load projects only when needed
4. **Request Cancellation** - Cancel pending requests on unmount

### Memory Management
- Clean up event listeners and timers
- Cancel pending requests on component unmount
- Avoid memory leaks in custom hooks
- Proper error boundary implementation

## Security Considerations

### Data Validation
- Validate API responses against expected schemas
- Sanitize user input before API calls
- Handle malformed server responses gracefully

### Authentication Integration
- Leverage existing HTTP client auth interceptors
- Handle token expiration and refresh
- Redirect to login on authentication failures

## Migration Strategy

### Backward Compatibility
- Maintain existing component interfaces
- Preserve existing UI behavior and styling
- Ensure no breaking changes to component props
- Keep existing dialog and form functionality intact

### Migration Approach
- Complete removal of all static sample data
- Replace with real API integration
- No fallback to static data - full API integration
- Proper error handling for API failures