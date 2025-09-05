import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import type { NavigationItem } from '../../types/common.types';

/**
 * Navigation configuration for the Discord-style sidebar
 * Defines the main navigation items with their icons, labels, and routing paths
 */
export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderIcon,
    path: '/project',
  },
  {
    id: 'task-groups',
    label: 'Task Groups',
    icon: AssignmentIcon,
    path: '/task-groups',
  },
];

/**
 * Default export for easy importing
 */
export default navigationItems;