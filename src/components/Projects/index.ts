// Main Projects component
export { default as Projects } from './Projects';

// Sub-components
export { default as ProjectsHeader } from './ProjectsHeader';
export { default as ProjectsFilters } from './ProjectsFilters';
export { default as ProjectsTable } from './ProjectsTable';
export { default as ProjectsPagination } from './ProjectsPagination';
export { default as CreateProjectModal } from './CreateProjectModal';

// Project Detail components
export { ProjectDetailView } from './ProjectDetailView';
export { ProjectDetailHeader } from './ProjectDetailHeader';
export { ProjectDetailTabs } from './ProjectDetailTabs';
export { ProjectDetailContent } from './ProjectDetailContent';
export { default as ProjectDetailSidebar } from './ProjectDetailSidebar';
export { ProjectTaskGroups } from './ProjectTaskGroups';
export { ProjectMembers } from './ProjectMembers';

// TypeScript interface exports for Project Detail components
export type { ProjectDetailHeaderProps } from './ProjectDetailHeader';
export type {
    ProjectDetailData,
    ProjectDetailTab,
    ProjectDetailViewProps,
    ProjectDetailTabsProps,
    ProjectDetailContentProps,
    ProjectDetailSidebarProps
} from '../../types/common.types';

// Sample data
export { sampleProjects, sampleProjectsDetail } from './sampleData';