# Requirements Document

## Introduction

This feature will create a Task Group management interface that mirrors the existing Projects interface functionality. Users will be able to view, filter, and create Task Groups through a dedicated page accessible via the navigation sidebar. The interface will display Task Groups in a table format with relevant information including the associated project and task count.

## Requirements

### Requirement 1

**User Story:** As a project manager, I want to view all Task Groups in a table format, so that I can get an overview of all task groups across projects.

#### Acceptance Criteria

1. WHEN the user clicks "Task Group" in the navigation THEN the system SHALL display a Task Group management page
2. WHEN the Task Group page loads THEN the system SHALL display a table with columns: Task Group Name, Project, and No. of Tasks
3. WHEN the Task Group page loads THEN the system SHALL show all active Task Groups by default
4. WHEN the table is displayed THEN the system SHALL show task group data in a responsive Material-UI table format

### Requirement 2

**User Story:** As a project manager, I want to filter Task Groups between "All" and "Archive" views, so that I can focus on active or archived task groups as needed.

#### Acceptance Criteria

1. WHEN the Task Group page loads THEN the system SHALL display filter buttons for "All" and "Archive"
2. WHEN the user clicks "All" filter THEN the system SHALL display all active task groups
3. WHEN the user clicks "Archive" filter THEN the system SHALL display archived task groups
4. WHEN a filter is selected THEN the system SHALL visually indicate the active filter state
5. WHEN switching between filters THEN the system SHALL update the table content accordingly

### Requirement 3

**User Story:** As a project manager, I want to create new Task Groups, so that I can organize tasks within projects.

#### Acceptance Criteria

1. WHEN the Task Group page loads THEN the system SHALL display a "New" button in the header
2. WHEN the user clicks the "New" button THEN the system SHALL open a modal dialog with the same design as the Project creation modal
3. WHEN the create modal is open THEN the system SHALL display "Create Task Group" as the modal title
4. WHEN the create modal is open THEN the system SHALL provide form fields for "Task Group Name" (required) and "Description" (optional)
5. WHEN the user clicks "Create Task Group" button THEN the system SHALL log the form data to console (API integration placeholder)
6. WHEN the user submits the form THEN the system SHALL close the modal
7. WHEN the user cancels Task Group creation THEN the system SHALL close the modal without saving

### Requirement 4

**User Story:** As a project manager, I want the Task Group interface to follow the same design patterns as the Projects interface, so that the application maintains consistency.

#### Acceptance Criteria

1. WHEN the Task Group page is displayed THEN the system SHALL use the same layout structure as the Projects page
2. WHEN the Task Group page is displayed THEN the system SHALL use consistent Material-UI components and styling
3. WHEN the Task Group page is displayed THEN the system SHALL follow the same responsive design patterns
4. WHEN the Task Group page is displayed THEN the system SHALL maintain the same header, filter, and table organization
5. WHEN the Task Group page is displayed THEN the system SHALL use the same pagination approach if needed

### Requirement 5

**User Story:** As a project manager, I want to see which project each Task Group belongs to, so that I can understand the organizational structure.

#### Acceptance Criteria

1. WHEN the Task Group table is displayed THEN the system SHALL show the associated project name for each Task Group
2. WHEN the Task Group table is displayed THEN the system SHALL display the number of tasks within each Task Group
3. WHEN the Task Group data is incomplete THEN the system SHALL handle missing project or task count information gracefully
4. WHEN the table is sorted THEN the system SHALL allow sorting by Task Group Name, Project, and No. of Tasks columns