// Main TaskGroups component
export { default as TaskGroups } from './TaskGroups';

// Sub-components
export { default as TaskGroupsHeader } from './TaskGroupsHeader';
export { default as TaskGroupsFilters } from './TaskGroupsFilters';
export { default as TaskGroupsTable } from './TaskGroupsTable';
export { default as TaskGroupsPagination } from './TaskGroupsPagination';
export { default as CreateTaskGroupModal } from './CreateTaskGroupModal';
export { default as TasksTable } from './TasksTable';

// Task Group Detail components
export { default as TaskGroupDetailView } from './TaskGroupDetailView';
export { default as TaskGroupDetailHeader } from './TaskGroupDetailHeader';
export { default as TasksPagination } from './TasksPagination';

// Sample data
export { 
    sampleTaskGroups, 
    sampleTasks, 
    sampleTaskGroupsDetail,
    getTasksByTaskGroupId,
    getTaskGroupDetailById,
    getPaginatedTasks
} from './sampleData';