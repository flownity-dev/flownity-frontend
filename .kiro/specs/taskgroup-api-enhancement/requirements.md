# Requirements Document

## Introduction

This feature implements API calling functionality for TaskGroups to replace the current static sample data. The implementation will follow the same simple pattern used in the Projects feature, providing basic data fetching, creation, and management capabilities.

## Requirements

### Requirement 1

**User Story:** As a user, I want to view all my TaskGroups from the backend API, so that I can see real data instead of static sample data.

#### Acceptance Criteria

1. WHEN I navigate to the TaskGroups page THEN the system SHALL fetch TaskGroups from the API
2. WHEN TaskGroups are loading THEN the system SHALL display a loading state
3. WHEN TaskGroups are loaded successfully THEN the system SHALL display them in the table
4. WHEN no TaskGroups exist THEN the system SHALL display an appropriate empty state
5. IF the API call fails THEN the system SHALL display a basic error message

### Requirement 2

**User Story:** As a user, I want to create new TaskGroups, so that I can organize my tasks effectively.

#### Acceptance Criteria

1. WHEN I click the "New Task Group" button THEN the system SHALL open a creation modal
2. WHEN I fill out the TaskGroup form and submit THEN the system SHALL call the create API
3. WHEN TaskGroup creation is successful THEN the system SHALL refresh the TaskGroups list
4. WHEN TaskGroup creation is successful THEN the system SHALL close the modal
5. IF TaskGroup creation fails THEN the system SHALL display an error message

### Requirement 3

**User Story:** As a user, I want to view detailed information about a specific TaskGroup, so that I can see its tasks and manage them.

#### Acceptance Criteria

1. WHEN I click on a TaskGroup row THEN the system SHALL navigate to the TaskGroup detail view
2. WHEN the TaskGroup detail view loads THEN the system SHALL fetch the TaskGroup data from the API
3. WHEN TaskGroup data is loaded THEN the system SHALL display the TaskGroup information
4. WHEN TaskGroup data is loaded THEN the system SHALL display associated tasks
5. IF the TaskGroup is not found THEN the system SHALL display a "not found" message

### Requirement 4

**User Story:** As a developer, I want to remove sample data from TaskGroups components, so that the application only uses real API data.

#### Acceptance Criteria

1. WHEN TaskGroups components are updated THEN they SHALL remove all sample data imports
2. WHEN the sample data file exists THEN it SHALL be deleted
3. WHEN components need data THEN they SHALL only fetch from API services
4. WHEN components render THEN they SHALL only display data from the backend
5. IF API data is not available THEN components SHALL show loading or error states

### Requirement 5

**User Story:** As a developer, I want to connect existing TaskGroups UI components to the API, so that they display real data instead of sample data.

#### Acceptance Criteria

1. WHEN updating TaskGroups components THEN the existing UI components SHALL be reused (TaskGroupsTable, CreateTaskGroupModal, etc.)
2. WHEN connecting to the API THEN the existing taskGroupService.ts SHALL be used
3. WHEN managing state THEN the components SHALL follow the same pattern as Projects components
4. WHEN components load THEN they SHALL fetch data from the API instead of using sample data
5. IF the existing service needs updates THEN they SHALL be minimal and focused on data fetching