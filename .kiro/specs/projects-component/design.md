# Design Document

## Overview

The Projects Component is a dedicated page component that provides a comprehensive interface for viewing and managing projects within the Flownity application. It replaces the current placeholder HomePage component for the `/projects` route and integrates seamlessly with the existing sidebar navigation system. The component follows Material-UI design patterns and maintains consistency with the current application theme and responsive design principles.

## Architecture

### Component Structure
```
Projects/
├── Projects.tsx              # Main component container
├── ProjectsHeader.tsx        # Header with title only
├── ProjectsFilters.tsx       # Filter buttons (All/Archived) and New button
├── ProjectsTable.tsx         # Table with project data
├── ProjectsPagination.tsx    # Pagination controls
└── index.ts                  # Export barrel

Common/
├── LoadingState.tsx          # Reusable loading component
├── EmptyState.tsx            # Reusable empty state component
├── ErrorState.tsx            # Reusable error state component
└── index.ts                  # Export barrel
```

### Integration Points
- **Routing**: Integrates with React Router at `/projects` route
- **Sidebar**: Connected to existing "Projects" navigation item
- **Theme**: Uses Material-UI theme system for consistent styling
- **Layout**: Follows the MainLayout pattern with sidebar integration

## Components and Interfaces

### Main Projects Component
```typescript
interface ProjectsProps {
  // No props needed - self-contained component
}

interface ProjectsState {
  activeFilter: 'all' | 'archived';
  currentPage: number;
  projects: Project[];
  loading: boolean;
  error: string | null;
}
```

### API Integration
```typescript
interface ProjectsApiResponse {
  projects: Project[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface ProjectsApiParams {
  filter?: 'all' | 'archived';
  page?: number;
  limit?: number;
}
```

### Project Data Interface
```typescript
interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'on-hold' | 'archived';
}
```

### Filter Component
```typescript
interface ProjectsFiltersProps {
  activeFilter: 'all' | 'archived';
  onFilterChange: (filter: 'all' | 'archived') => void;
  onNewProject: () => void;
}
```

### Table Component
```typescript
interface ProjectsTableProps {
  projects: Project[];
  loading?: boolean;
}
```

### Pagination Component
```typescript
interface ProjectsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

### State Components (Reusable)
```typescript
interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType;
}

interface ErrorStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}
```

## Data Models

### Project Model
```typescript
interface Project {
  id: string;                    // Unique identifier
  name: string;                  // Project name/title
  startDate: Date;               // Project start date
  endDate: Date;                 // Project end date
  status: ProjectStatus;         // Current project status
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}

type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'archived';
```

### Filter State
```typescript
interface FilterState {
  activeFilter: 'all' | 'archived';
}
```

### Pagination State
```typescript
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
```

## User Interface Design

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Projects Header                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Projects                                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Filter Section                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [All] [Archived]                                [New]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Projects Table                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Project Name | Start Date | End Date | Status | Actions │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │ Sample Proj  | 2024-01-01 | 2024-06-01 | Active |  ...  │ │
│ │ ...          | ...        | ...        | ...    |  ...  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Pagination                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                        [< 1 2 3 4 5 >]  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Material-UI Components Used
- **Container**: Main layout container with responsive maxWidth
- **Typography**: Page title and section headers
- **Button**: Filter buttons, New button, pagination controls
- **ButtonGroup**: Filter button grouping
- **Table**: Project data display
- **TableContainer**: Scrollable table wrapper
- **TableHead/TableBody/TableRow/TableCell**: Table structure
- **Chip**: Status indicators
- **Box**: Layout and spacing containers
- **Paper**: Elevated surfaces for table and sections

### Responsive Design
- **Desktop (lg+)**: Full table with all columns visible
- **Tablet (md-lg)**: Condensed table with abbreviated columns
- **Mobile (sm-)**: Stacked card layout instead of table

### Theme Integration
- Uses current Material-UI theme colors and typography
- Follows existing component spacing patterns (Container maxWidth="lg", mt: 4)
- Maintains consistent button styling and elevation levels
- Respects theme mode (light/dark/high-contrast) preferences

## Error Handling

### Loading States
- Use reusable LoadingState component with configurable message and size
- Filter buttons remain interactive during loading
- Pagination controls are disabled during loading

### Empty States
- Use reusable EmptyState component with configurable title, description, and action
- "No projects found" message when no projects match current filter
- "Create your first project" call-to-action for empty project list
- Appropriate messaging for different filter states

### Error States
- Use reusable ErrorState component with configurable title, description, and retry action
- Graceful degradation when data is unavailable
- User-friendly error messages with actionable guidance

## Implementation Notes

### Styling Approach
- Use Material-UI's `sx` prop for component-specific styling
- Leverage theme spacing and breakpoint utilities
- Maintain consistency with existing component patterns
- Follow responsive design principles established in Homepage component

### State Management
- Use React hooks (useState, useEffect) for local component state
- No external state management needed for initial implementation
- Prepare for future integration with global state management

### Data Integration
- Initially use mock/static data for development
- Design interfaces to accommodate future API integration
- Implement proper TypeScript types for type safety
- API calling functionality will be implemented in future iterations

### Performance Considerations
- Implement virtual scrolling for large datasets (future enhancement)
- Use React.memo for expensive child components
- Optimize re-renders with proper dependency arrays
- Consider pagination to limit initial data load