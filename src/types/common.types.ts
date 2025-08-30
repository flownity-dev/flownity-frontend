import React from 'react';

/**
 * Navigation item interface for sidebar navigation
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path: string;
  isActive?: boolean;
}

/**
 * Sidebar state interface for managing collapse/expand state
 */
export interface SidebarState {
  isCollapsed: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Context type for sidebar state management
 */
export interface SidebarContextType {
  sidebarState: SidebarState;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

/**
 * User profile interface for sidebar footer
 */
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Theme-related interfaces for sidebar styling
 */
export interface SidebarTheme {
  collapsed: {
    width: number;
  };
  expanded: {
    width: number;
  };
  transition: {
    duration: number;
    easing: string;
  };
}

/**
 * Navigation configuration type for defining sidebar navigation structure
 */
export interface NavigationConfig {
  items: NavigationItem[];
  userProfile: UserProfile;
  theme: SidebarTheme;
}

/**
 * Sidebar component props interface
 */
export interface SidebarProps {
  navigationItems?: NavigationItem[];
  userProfile?: UserProfile;
}

/**
 * Individual sidebar navigation item props
 */
export interface SidebarNavItemProps {
  item: NavigationItem;
  isCollapsed: boolean;
  onClick: (path: string) => void;
}

/**
 * Sidebar header component props
 */
export interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Sidebar footer component props
 */
export interface SidebarFooterProps {
  userProfile: UserProfile;
  isCollapsed: boolean;
}

/**
 * Project status type union for all possible project states
 */
export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'archived';

/**
 * Project interface for project data structure
 */
export interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
}

/**
 * Extended project interface for detailed project view
 */
export interface ProjectDetailData {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: string;
}

/**
 * Tab type for project detail navigation
 */
export type ProjectDetailTab = 'task-groups' | 'members';

/**
 * Props interface for ProjectDetailHeader component
 */
export interface ProjectDetailHeaderProps {
  project: ProjectDetailData;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

/**
 * Props interface for ProjectDetailTabs component
 */
export interface ProjectDetailTabsProps {
  activeTab: ProjectDetailTab;
  onTabChange: (tab: ProjectDetailTab) => void;
}

/**
 * Props interface for ProjectDetailContent component
 */
export interface ProjectDetailContentProps {
  activeTab: ProjectDetailTab;
  project: ProjectDetailData;
}

/**
 * Props interface for ProjectDetailSidebar component
 */
export interface ProjectDetailSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  project: ProjectDetailData;
}

/**
 * Props interface for main ProjectDetailView component
 */
export interface ProjectDetailViewProps {
  className?: string;
}

/**
 * Projects component props interface
 */
export interface ProjectsProps {
  // No props needed - self-contained component
  className?: string;
}

/**
 * Projects header component props interface
 */
export interface ProjectsHeaderProps {
  // No props needed - displays static title
  className?: string;
}

/**
 * Projects filters component props interface
 */
export interface ProjectsFiltersProps {
  activeFilter: 'all' | 'archived';
  onFilterChange: (filter: 'all' | 'archived') => void;
  onNewProject: () => void;
  isMobile?: boolean;
}

/**
 * Projects table component props interface
 */
export interface ProjectsTableProps {
  projects: Project[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

/**
 * Projects pagination component props interface
 */
export interface ProjectsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isMobile?: boolean;
}

/**
 * Priority type for project creation
 */
export type ProjectPriority = 'low' | 'medium' | 'high';

/**
 * Priority option interface for select dropdown
 */
export interface PriorityOption {
  value: ProjectPriority;
  label: string;
}

/**
 * Form data interface for creating new projects
 */
export interface CreateProjectFormData {
  name: string;
  description?: string;
  priority: ProjectPriority;
}

/**
 * Create project modal component props interface
 */
export interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (projectData: CreateProjectFormData) => void;
}

/**
 * Priority options constants for project creation dropdown
 */
export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

/**
 * Task group status type union for all possible task group states
 */
export type TaskGroupStatus = 'active' | 'archived';

/**
 * Task group interface for task group data structure
 */
export interface TaskGroup {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  taskCount: number;
  status: TaskGroupStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Form data interface for creating new task groups
 */
export interface CreateTaskGroupFormData {
  name: string;
  description?: string;
}

/**
 * Task groups filters component props interface
 */
export interface TaskGroupsFiltersProps {
  activeFilter: 'all' | 'archived';
  onFilterChange: (filter: 'all' | 'archived') => void;
  onNewTaskGroup: () => void;
  isMobile?: boolean;
}

/**
 * Task groups table component props interface
 */
export interface TaskGroupsTableProps {
  taskGroups: TaskGroup[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

/**
 * Task groups pagination component props interface
 */
export interface TaskGroupsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isMobile?: boolean;
}

/**
 * Create task group modal component props interface
 */
export interface CreateTaskGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskGroupData: CreateTaskGroupFormData) => void;
}