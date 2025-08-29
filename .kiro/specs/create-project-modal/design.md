# Design Document

## Overview

The Create Project Modal feature adds a modal dialog component that appears when users click the "New" button on the Projects page. The modal provides a form interface for creating new projects and integrates seamlessly with the existing Material-UI design system and theme configuration.

## Architecture

### Component Structure
```
Projects (existing)
├── ProjectsFilters (existing - modified)
└── CreateProjectModal (new)
    ├── Modal Container (MUI Dialog)
    ├── Form Fields (MUI TextField, Select)
    └── Action Buttons (MUI Button)
```

### State Management
- Modal open/close state will be managed in the parent `Projects` component
- Form data will be managed locally within the `CreateProjectModal` component using React hooks
- No external state management library needed for this simple form

### Integration Points
- The existing `onNewProject` handler in `ProjectsFilters` will be updated to open the modal
- The modal will be rendered conditionally in the `Projects` component
- Form submission will initially log data to console as specified in requirements

## Components and Interfaces

### CreateProjectModal Component

**Props Interface:**
```typescript
interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (projectData: CreateProjectFormData) => void;
}
```

**Form Data Interface:**
```typescript
interface CreateProjectFormData {
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}
```

**Component Features:**
- Uses MUI `Dialog` component for modal container
- Implements `DialogTitle`, `DialogContent`, and `DialogActions` for structure
- Responsive design that adapts to mobile screens
- Auto-focus on first input field when opened
- Form validation for required fields
- Keyboard navigation support (Tab, Escape)

### Updated Projects Component

**State Additions:**
```typescript
const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
```

**Handler Functions:**
```typescript
const handleOpenCreateModal = () => setIsCreateModalOpen(true);
const handleCloseCreateModal = () => setIsCreateModalOpen(false);
const handleCreateProject = (projectData: CreateProjectFormData) => {
  console.log('Creating project:', projectData);
  handleCloseCreateModal();
};
```

## Data Models

### Form Field Specifications

**Project Name Field:**
- Type: Text input (required)
- Placeholder: "Project XYZ"
- Validation: Required, max 100 characters
- MUI Component: `TextField`

**Description Field:**
- Type: Multiline text input (optional)
- Label: "Description (Optional)"
- Max rows: 4
- MUI Component: `TextField` with `multiline` prop

**Priority Field:**
- Type: Select dropdown (required)
- Options: Low, Medium, High
- Default: Medium
- MUI Component: `Select` with `MenuItem`

### Priority Options Data:
```typescript
const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];
```

## Error Handling

### Form Validation
- Client-side validation for required fields
- Real-time validation feedback using MUI form helper text
- Prevent form submission if validation fails
- Clear validation errors when user corrects input

### Modal State Management
- Proper cleanup of form state when modal closes
- Handle edge cases like rapid open/close actions
- Ensure modal state doesn't persist between sessions

## Testing Strategy

As specified in requirements, no automated tests will be implemented for this feature. Manual testing will cover:

### Manual Test Cases
1. **Modal Display:** Verify modal opens when "New" button is clicked
2. **Form Interaction:** Test all form fields accept input correctly
3. **Responsive Design:** Verify modal adapts to different screen sizes
4. **Keyboard Navigation:** Test Tab order and Escape key functionality
5. **Form Submission:** Verify console logging works correctly
6. **Modal Closure:** Test clicking outside modal and Discard button
7. **Theme Integration:** Verify modal follows current MUI theme colors

### Browser Testing
- Test on Chrome, Firefox, Safari
- Test on mobile devices (iOS Safari, Android Chrome)
- Verify accessibility with keyboard-only navigation

## Implementation Notes

### MUI Theme Integration
- Use theme colors for buttons: `primary` for Create Project, `inherit` for Discard
- Follow theme typography scale for text elements
- Respect theme border radius and spacing values
- Support both light and dark theme modes

### Responsive Behavior
- Modal width: 90% on mobile, fixed 500px on desktop
- Stack form fields vertically on all screen sizes
- Adjust button layout for mobile (full width vs inline)

### Performance Considerations
- Modal component will be conditionally rendered to avoid unnecessary DOM nodes
- Form state will be reset on modal close to prevent memory leaks
- No heavy computations or API calls in this initial implementation

### Accessibility Features
- Proper ARIA labels on form fields
- Focus management (auto-focus first field)
- Keyboard navigation support