# Design Document

## Overview

The Task Group management feature will replicate the existing Projects interface architecture, providing a consistent user experience across the application. The implementation will follow the established component structure, state management patterns, and responsive design principles already used in the Projects module.

The feature will consist of a main Task Groups page with filtering, table display, pagination, and a creation modal, all following the same design patterns as the existing Projects interface.

## Architecture

### Component Structure

The Task Group management feature will follow the same modular component architecture as Projects:

```
src/components/TaskGroups/
├── TaskGroups.tsx              # Main container component
├── TaskGroupsHeader.tsx        # Page header with title
├── TaskGroupsFilters.tsx       # Filter buttons and New button
├── TaskGroupsTable.tsx         # Responsive table/card display
├── TaskGroupsPagination.tsx    # Pagination controls
├── CreateTaskGroupModal.tsx    # Modal for creating new task groups
├── sampleData.ts              # Sample data for development
└── index.ts                   # Barrel exports
```

### State Management

Following the same patterns as Projects, the main TaskGroups component will manage:
- Filter state ('all' | 'archived')
- Pagination state (currentPage, itemsPerPage)
- Modal state (isCreateModalOpen)
- Loading and error states
- Task groups data array

### Routing Integration

The feature will integrate with the existing navigation system:
- Route: `/task-groups`
- Navigation item already exists in `navigationConfig.ts`
- Will be added to the main App routing configuration

## Components and Interfaces

### TaskGroups (Main Container)

**Purpose:** Main container component that orchestrates all child components and manages state.

**Props:** None (self-contained like Projects)

**State:**
- `activeFilter: 'all' | 'archived'`
- `currentPage: number`
- `taskGroups: TaskGroup[]`
- `loading: boolean`
- `error: string | null`
- `isCreateModalOpen: boolean`

**Responsibilities:**
- Filter task groups based on active filter
- Handle pagination logic
- Manage modal state
- Coordinate between child components

### TaskGroupsHeader

**Purpose:** Display page title.

**Props:** None

**Implementation:** Simple header component displaying "Task Groups" title, following the same styling as ProjectsHeader.

### TaskGroupsFilters

**Purpose:** Filter controls and New button for task group creation.

**Props:**
- `activeFilter: 'all' | 'archived'`
- `onFilterChange: (filter: 'all' | 'archived') => void`
- `onNewTaskGroup: () => void`
- `isMobile?: boolean`

**Implementation:** Two filter buttons (All/Archive) and a New button, following the same layout and styling as ProjectsFilters.

### TaskGroupsTable

**Purpose:** Responsive table/card display for task groups with columns: Task Group Name, Project, No. of Tasks.

**Props:**
- `taskGroups: TaskGroup[]`
- `loading?: boolean`
- `error?: string | null`
- `onRetry?: () => void`
- `isMobile?: boolean`
- `isTablet?: boolean`

**Responsive Behavior:**
- **Desktop/Tablet:** Table format with three columns
- **Mobile:** Card format showing all information in stacked layout

**Table Columns:**
1. **Task Group Name** - Primary identifier
2. **Project** - Associated project name
3. **No. of Tasks** - Count of tasks in the group

### TaskGroupsPagination

**Purpose:** Pagination controls for large datasets.

**Props:**
- `currentPage: number`
- `totalPages: number`
- `onPageChange: (page: number) => void`
- `isMobile?: boolean`

**Implementation:** Identical to ProjectsPagination component.

### CreateTaskGroupModal

**Purpose:** Modal dialog for creating new task groups.

**Props:**
- `open: boolean`
- `onClose: () => void`
- `onSubmit: (taskGroupData: CreateTaskGroupFormData) => void`

**Form Fields:**
- **Task Group Name** (required) - Text input with validation
- **Description** (optional) - Multi-line text area

**Validation:**
- Task Group Name: Required, max 100 characters
- Description: Optional, no length limit

**Behavior:**
- Form submission logs data to console (API placeholder)
- Modal closes after successful submission
- Form resets on close/cancel

## Data Models

### TaskGroup Interface

```typescript
export interface TaskGroup {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  taskCount: number;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateTaskGroupFormData Interface

```typescript
export interface CreateTaskGroupFormData {
  name: string;
  description?: string;
}
```

### Component Props Interfaces

```typescript
export interface TaskGroupsFiltersProps {
  activeFilter: 'all' | 'archived';
  onFilterChange: (filter: 'all' | 'archived') => void;
  onNewTaskGroup: () => void;
  isMobile?: boolean;
}

export interface TaskGroupsTableProps {
  taskGroups: TaskGroup[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

export interface CreateTaskGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskGroupData: CreateTaskGroupFormData) => void;
}
```

## Error Handling

### Loading States
- Display loading spinner in table area while data is being fetched
- Use the existing LoadingState component from Common components

### Error States
- Display error message with retry button for failed data loading
- Use the existing ErrorState component from Common components
- Form validation errors displayed inline with field-specific messages

### Empty States
- Display empty state message when no task groups match current filter
- Use the existing EmptyState component with appropriate icon and messaging

## Implementation Notes

### Styling Approach
- Use Material-UI components for consistency with existing design system
- Follow the same responsive breakpoints as Projects components
- Maintain consistent spacing, typography, and color schemes

### Performance Considerations
- Implement pagination to handle large datasets efficiently
- Use React.memo for child components to prevent unnecessary re-renders
- Optimize table rendering for mobile card view

### Accessibility
- Proper ARIA labels and roles for all interactive elements

### Future Extensibility
- Component structure allows for easy addition of sorting functionality
- Modal form can be extended with additional fields as needed
- Table columns can be made configurable for different views