# Design Document

## Overview

The Task Group Detail View will follow the same architectural pattern as the existing Project Detail View, providing a consistent user experience across the application. The component will display task group information in a header section and present tasks in a responsive table format with pagination. The design leverages existing components and patterns to maintain consistency while introducing task-specific functionality.

## Architecture

### Component Hierarchy

```
TaskGroupDetailView (Main Container)
├── TaskGroupDetailHeader (Header with back button, title, description, New button)
├── TasksTable (Responsive table/cards for tasks)
└── TasksPagination (Page navigation controls)
```

### Routing Integration

The component will be integrated into the existing React Router structure:
- Route: `/task-groups/:id`
- Parameter extraction: `useParams<{ id: string }>()`
- Navigation: Back button navigates to `/task-groups`

### State Management

The component will manage the following state:
- `taskGroup`: Current task group data
- `tasks`: Array of tasks for the current task group
- `loading`: Loading state for data fetching
- `error`: Error state for failed requests
- `currentPage`: Current pagination page
- `totalPages`: Total number of pages

## Components and Interfaces

### TaskGroupDetailView Component

**Purpose**: Main container component that orchestrates the task group detail view

**Props Interface**:
```typescript
interface TaskGroupDetailViewProps {
  className?: string;
}
```

**Key Features**:
- URL parameter extraction for task group ID
- Data loading and error handling
- Responsive layout management
- State management for pagination

### TaskGroupDetailHeader Component

**Purpose**: Header section displaying task group information and actions

**Props Interface**:
```typescript
interface TaskGroupDetailHeaderProps {
  taskGroup: TaskGroupDetailData;
  onNewTask: () => void;
}
```

**Layout**:
- Left section: Back button, task group name, description
- Right section: "New" button for task creation
- Responsive design following Project Detail Header pattern

### TasksTable Component

**Purpose**: Responsive table/card display for tasks within the task group

**Props Interface**:
```typescript
interface TasksTableProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
}
```

**Columns**:
- Name: Task title/name
- Deadline Date: Formatted date display
- Assignee: Person assigned to the task
- Approver: Person responsible for approval

**Responsive Behavior**:
- Desktop: Full table with all columns
- Tablet: Responsive table layout
- Mobile: Card-based layout

### TasksPagination Component

**Purpose**: Navigation controls for paginated task display

**Props Interface**:
```typescript
interface TasksPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isMobile?: boolean;
}
```

## Data Models

### TaskGroupDetailData Interface

```typescript
interface TaskGroupDetailData {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  taskCount: number;
  status: TaskGroupStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

### Task Interface

```typescript
interface Task {
  id: string;
  name: string;
  deadlineDate: Date;
  assignee: string;
  approver: string;
  status: TaskStatus;
  taskGroupId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### TaskStatus Type

```typescript
type TaskStatus = 'new' | 'in-progress' | 'completed' | 'close';
```

### Sample Data Structure

The component will use sample data following the existing pattern:
- `sampleTaskGroupsDetail`: Extended task group data for detail view
- `sampleTasks`: Array of tasks with statuses (new, in-progress, completed, close) and assignees
- Helper functions for pagination and data filtering

## Error Handling

The component will leverage existing error handling components from `src/components/Common/`:

### Error States

1. **Task Group Not Found**: Use `ErrorState` component with back navigation
2. **Loading States**: Use `LoadingState` component during data fetching
3. **Tasks Loading Error**: Use `ErrorState` component in table area with retry functionality
4. **Empty States**: Use `EmptyState` component when no tasks are found
5. **Invalid Task Group ID**: Handle with `ErrorState` component

### Error Boundaries

- Utilize existing `ErrorBoundary` component for graceful failure handling
- Follow the same error handling patterns as `ProjectDetailView`
- Consistent error messaging using existing error components



## Implementation Notes

### Responsive Design

- Follow Material-UI breakpoint system (`xs`, `sm`, `md`, `lg`, `xl`)
- Use existing responsive patterns from Projects components
- Maintain consistent spacing and typography scales

### Performance Considerations

- Implement pagination to limit DOM elements
- Use React.memo for table rows to prevent unnecessary re-renders
- Lazy load task data when navigating between pages

### Accessibility

- Proper heading hierarchy (h1 for task group name)
- Follow existing accessibility patterns from Project components

### Code Organization

- Follow existing file structure in `src/components/TaskGroups/`
- Create separate files for each component
- Export components through index.ts barrel file
- Maintain consistent naming conventions