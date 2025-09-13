# Design Document

## Overview

This design implements API calling functionality for TaskGroups by replacing static sample data with real API calls. The implementation follows the same simple pattern used in the Projects feature, reusing existing UI components and connecting them to the taskGroupService.ts API service.

## Architecture

### Current State
- TaskGroups components use static sample data from `sampleData.ts`
- UI components (TaskGroupsTable, CreateTaskGroupModal, etc.) are already implemented
- Basic taskGroupService.ts exists with API methods
- Components handle pagination and filtering client-side with sample data

### Target State
- TaskGroups components fetch data from API using taskGroupService.ts
- Remove sample data file and all references to it
- Maintain existing UI components without changes
- Follow the same state management pattern as Projects components

## Components and Interfaces

### Data Flow
```
TaskGroups Component → API Service → Backend API
                   ↓
            State Management (loading, error, data)
                   ↓
            UI Components (Table, Modal, Pagination)
```

### Component Updates

#### TaskGroups.tsx (Main Component)
- Remove sample data imports and usage
- Add API state management (loading, error, data)
- Implement data fetching on component mount
- Add error handling and retry functionality
- Connect create modal to API service
- Maintain existing pagination and filtering logic

#### Service Layer
- Update existing taskGroupService.ts methods to handle API response transformation
- Add transformation functions to map backend fields to frontend interfaces
- Ensure proper error handling in service calls

### State Management Pattern

Following the Projects pattern:
```typescript
const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
```

## Data Models

### API Response Format
The backend returns TaskGroup data in this format:
```typescript
interface ApiTaskGroup {
  id: number;
  task_group_title: string;
  project_id: number;
  status_id: number;
  due_from: string | null;
  due_to: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
```

### Frontend Interface
The frontend expects TaskGroup data in this format:
```typescript
interface TaskGroup {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  taskCount: number;
  status: TaskGroupStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

### Data Transformation
The service layer will transform API responses to frontend format:
- `id` (number) → `id` (string)
- `task_group_title` → `name`
- `project_id` (number) → `projectId` (string)
- `status_id` → `status` (mapped to TaskGroupStatus enum)
- `created_at` (string) → `createdAt` (Date)
- `updated_at` (string) → `updatedAt` (Date)
- Add default values for missing fields (projectName, taskCount)

### TaskGroup Detail View
For the detail view, the service should return TaskGroupDetailData with additional description field.

## Error Handling

### Existing Common Components
The application already has reusable components for common states:
- `LoadingState` - For displaying loading spinners
- `ErrorState` - For displaying error messages with retry functionality
- `EmptyState` - For displaying empty data states

### State Management
- Loading states: Use existing LoadingState component
- Error states: Use existing ErrorState component with retry callback
- Empty data: Use existing EmptyState component



## Implementation Approach

### Phase 1: Remove Sample Data
1. Delete `sampleData.ts` file
2. Remove all sample data imports from components
3. Update components to use empty initial states

### Phase 2: Connect API
1. Update TaskGroups.tsx to use API calls
2. Add loading and error state management
3. Connect create modal to API service
4. Update detail view to fetch from API

### Phase 3: Testing and Refinement
1. Test all functionality with real API
2. Ensure error handling works properly
3. Verify UI components display correctly
4. Test edge cases (empty data, errors)

## File Changes Summary

### Files to Modify
- `src/components/TaskGroups/TaskGroups.tsx` - Main component updates
- `src/components/TaskGroups/TaskGroupDetailView.tsx` - Detail view API integration
- `src/services/taskGroupService.ts` - Add API response transformation

### Files to Delete
- `src/components/TaskGroups/sampleData.ts` - Remove sample data

### Files to Keep Unchanged
- All other TaskGroups UI components (Table, Modal, Filters, etc.)
- Type definitions in `common.types.ts`