import type { TaskGroup } from '../../types/common.types';

/**
 * Sample task groups data for development and testing
 * Includes a variety of task groups with different projects, task counts, and statuses
 * for testing pagination, filtering, and display functionality
 */
export const sampleTaskGroups: TaskGroup[] = [
  {
    id: 'tg-001',
    name: 'Frontend Development',
    projectId: 'proj-001',
    projectName: 'E-commerce Platform',
    taskCount: 12,
    status: 'active',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-02-20T14:30:00Z')
  },
  {
    id: 'tg-002',
    name: 'API Integration',
    projectId: 'proj-001',
    projectName: 'E-commerce Platform',
    taskCount: 8,
    status: 'active',
    createdAt: new Date('2024-01-20T09:15:00Z'),
    updatedAt: new Date('2024-02-18T16:45:00Z')
  },
  {
    id: 'tg-003',
    name: 'Database Migration',
    projectId: 'proj-002',
    projectName: 'Customer Portal',
    taskCount: 5,
    status: 'archived',
    createdAt: new Date('2023-11-10T11:30:00Z'),
    updatedAt: new Date('2024-01-05T13:20:00Z')
  },
  {
    id: 'tg-004',
    name: 'User Authentication',
    projectId: 'proj-002',
    projectName: 'Customer Portal',
    taskCount: 15,
    status: 'active',
    createdAt: new Date('2024-02-01T08:45:00Z'),
    updatedAt: new Date('2024-02-25T10:15:00Z')
  },
  {
    id: 'tg-005',
    name: 'Payment Processing',
    projectId: 'proj-003',
    projectName: 'Mobile App',
    taskCount: 20,
    status: 'active',
    createdAt: new Date('2024-01-25T14:20:00Z'),
    updatedAt: new Date('2024-02-22T09:30:00Z')
  },
  {
    id: 'tg-006',
    name: 'Legacy Code Cleanup',
    projectId: 'proj-003',
    projectName: 'Mobile App',
    taskCount: 3,
    status: 'archived',
    createdAt: new Date('2023-12-05T15:10:00Z'),
    updatedAt: new Date('2024-01-15T11:45:00Z')
  },
  {
    id: 'tg-007',
    name: 'Performance Optimization',
    projectId: 'proj-004',
    projectName: 'Analytics Dashboard',
    taskCount: 7,
    status: 'active',
    createdAt: new Date('2024-02-10T12:00:00Z'),
    updatedAt: new Date('2024-02-28T15:20:00Z')
  },
  {
    id: 'tg-008',
    name: 'Data Visualization',
    projectId: 'proj-004',
    projectName: 'Analytics Dashboard',
    taskCount: 18,
    status: 'active',
    createdAt: new Date('2024-01-30T10:30:00Z'),
    updatedAt: new Date('2024-02-26T14:10:00Z')
  },
  {
    id: 'tg-009',
    name: 'Security Audit',
    projectId: 'proj-005',
    projectName: 'Internal Tools',
    taskCount: 9,
    status: 'archived',
    createdAt: new Date('2023-10-20T13:45:00Z'),
    updatedAt: new Date('2023-12-15T16:30:00Z')
  },
  {
    id: 'tg-010',
    name: 'Documentation Update',
    projectId: 'proj-005',
    projectName: 'Internal Tools',
    taskCount: 4,
    status: 'active',
    createdAt: new Date('2024-02-05T09:00:00Z'),
    updatedAt: new Date('2024-02-24T12:45:00Z')
  }
];

/**
 * Helper function to get task groups by status
 */
export const getTaskGroupsByStatus = (status: 'all' | 'archived'): TaskGroup[] => {
  if (status === 'all') {
    return sampleTaskGroups.filter(tg => tg.status === 'active');
  }
  return sampleTaskGroups.filter(tg => tg.status === 'archived');
};

/**
 * Helper function to get paginated task groups
 */
export const getPaginatedTaskGroups = (
  taskGroups: TaskGroup[],
  page: number,
  itemsPerPage: number
): TaskGroup[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return taskGroups.slice(startIndex, endIndex);
};

/**
 * Helper function to calculate total pages
 */
export const getTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};