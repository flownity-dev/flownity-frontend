import type { TaskGroup, TaskGroupDetailData, Task } from '../../types/common.types';

/**
 * Sample task groups data for development and testing
 * Includes 2 task groups: one with many tasks to show pagination, one empty to show empty state
 */
export const sampleTaskGroups: TaskGroup[] = [
  {
    id: '1',
    name: 'Frontend Development',
    projectId: 'proj-001',
    projectName: 'E-commerce Platform',
    taskCount: 15,
    status: 'active',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-02-20T14:30:00Z')
  },
  {
    id: '2',
    name: 'API Integration',
    projectId: 'proj-001',
    projectName: 'E-commerce Platform',
    taskCount: 0,
    status: 'active',
    createdAt: new Date('2024-01-20T09:15:00Z'),
    updatedAt: new Date('2024-02-18T16:45:00Z')
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

/**
 * Sample tasks data for development and testing
 * Includes 15 tasks for 1 to test pagination (will show 2 pages with 10 items per page)
 * No tasks for 2 to test empty state
 */
export const sampleTasks: Task[] = [
  {
    id: 'task-001',
    name: 'Implement user registration form',
    deadlineDate: new Date('2024-03-15T17:00:00Z'),
    assignee: 'John Smith',
    approver: 'Sarah Johnson',
    status: 'in-progress',
    taskGroupId: '1',
    createdAt: new Date('2024-02-01T09:00:00Z'),
    updatedAt: new Date('2024-02-20T14:30:00Z')
  },
  {
    id: 'task-002',
    name: 'Design product catalog layout',
    deadlineDate: new Date('2024-03-10T12:00:00Z'),
    assignee: 'Emily Davis',
    approver: 'Michael Brown',
    status: 'completed',
    taskGroupId: '1',
    createdAt: new Date('2024-01-25T10:15:00Z'),
    updatedAt: new Date('2024-02-18T16:45:00Z')
  },
  {
    id: 'task-003',
    name: 'Setup shopping cart functionality',
    deadlineDate: new Date('2024-03-20T15:30:00Z'),
    assignee: 'David Wilson',
    approver: 'Sarah Johnson',
    status: 'new',
    taskGroupId: '1',
    createdAt: new Date('2024-02-05T11:30:00Z'),
    updatedAt: new Date('2024-02-05T11:30:00Z')
  },
  {
    id: 'task-004',
    name: 'Integrate payment gateway API',
    deadlineDate: new Date('2024-03-25T18:00:00Z'),
    assignee: 'Lisa Anderson',
    approver: 'Michael Brown',
    status: 'new',
    taskGroupId: '1',
    createdAt: new Date('2024-02-10T08:45:00Z'),
    updatedAt: new Date('2024-02-10T08:45:00Z')
  },
  {
    id: 'task-005',
    name: 'Implement order tracking system',
    deadlineDate: new Date('2024-03-18T14:00:00Z'),
    assignee: 'Robert Taylor',
    approver: 'Sarah Johnson',
    status: 'in-progress',
    taskGroupId: '1',
    createdAt: new Date('2024-02-08T13:20:00Z'),
    updatedAt: new Date('2024-02-22T10:15:00Z')
  },
  {
    id: 'task-006',
    name: 'Create API documentation',
    deadlineDate: new Date('2024-03-12T16:30:00Z'),
    assignee: 'Jennifer Martinez',
    approver: 'Michael Brown',
    status: 'close',
    taskGroupId: '1',
    createdAt: new Date('2024-01-30T15:10:00Z'),
    updatedAt: new Date('2024-02-25T09:30:00Z')
  },
  {
    id: 'task-007',
    name: 'Setup user authentication flow',
    deadlineDate: new Date('2024-03-22T13:45:00Z'),
    assignee: 'Christopher Lee',
    approver: 'Sarah Johnson',
    status: 'in-progress',
    taskGroupId: '1',
    createdAt: new Date('2024-02-12T12:00:00Z'),
    updatedAt: new Date('2024-02-26T14:10:00Z')
  },
  {
    id: 'task-008',
    name: 'Implement password reset functionality',
    deadlineDate: new Date('2024-03-28T11:00:00Z'),
    assignee: 'Amanda White',
    approver: 'Michael Brown',
    status: 'new',
    taskGroupId: '1',
    createdAt: new Date('2024-02-15T09:30:00Z'),
    updatedAt: new Date('2024-02-15T09:30:00Z')
  },
  {
    id: 'task-009',
    name: 'Design mobile payment interface',
    deadlineDate: new Date('2024-03-30T17:15:00Z'),
    assignee: 'Kevin Garcia',
    approver: 'Sarah Johnson',
    status: 'completed',
    taskGroupId: '1',
    createdAt: new Date('2024-02-18T14:45:00Z'),
    updatedAt: new Date('2024-02-28T15:20:00Z')
  },
  {
    id: 'task-010',
    name: 'Optimize database queries',
    deadlineDate: new Date('2024-03-14T10:30:00Z'),
    assignee: 'Michelle Rodriguez',
    approver: 'Michael Brown',
    status: 'in-progress',
    taskGroupId: '1',
    createdAt: new Date('2024-02-20T11:15:00Z'),
    updatedAt: new Date('2024-02-27T13:45:00Z')
  },
  {
    id: 'task-011',
    name: 'Implement responsive design',
    deadlineDate: new Date('2024-04-01T16:00:00Z'),
    assignee: 'Sarah Wilson',
    approver: 'Sarah Johnson',
    status: 'new',
    taskGroupId: '1',
    createdAt: new Date('2024-02-25T10:00:00Z'),
    updatedAt: new Date('2024-02-25T10:00:00Z')
  },
  {
    id: 'task-012',
    name: 'Add search functionality',
    deadlineDate: new Date('2024-04-05T14:30:00Z'),
    assignee: 'Mark Thompson',
    approver: 'Michael Brown',
    status: 'new',
    taskGroupId: '1',
    createdAt: new Date('2024-02-26T11:15:00Z'),
    updatedAt: new Date('2024-02-26T11:15:00Z')
  },
  {
    id: 'task-013',
    name: 'Implement product filtering',
    deadlineDate: new Date('2024-04-08T13:00:00Z'),
    assignee: 'Jessica Brown',
    approver: 'Sarah Johnson',
    status: 'in-progress',
    taskGroupId: '1',
    createdAt: new Date('2024-02-27T09:30:00Z'),
    updatedAt: new Date('2024-03-01T15:45:00Z')
  },
  {
    id: 'task-014',
    name: 'Setup email notifications',
    deadlineDate: new Date('2024-04-10T12:00:00Z'),
    assignee: 'Alex Johnson',
    approver: 'Michael Brown',
    status: 'new',
    taskGroupId: '1',
    createdAt: new Date('2024-02-28T14:20:00Z'),
    updatedAt: new Date('2024-02-28T14:20:00Z')
  },
  {
    id: 'task-015',
    name: 'Create user dashboard',
    deadlineDate: new Date('2024-04-12T17:30:00Z'),
    assignee: 'Rachel Davis',
    approver: 'Sarah Johnson',
    status: 'new',
    taskGroupId: '1',
    createdAt: new Date('2024-03-01T08:45:00Z'),
    updatedAt: new Date('2024-03-01T08:45:00Z')
  }
];

/**
 * Sample task groups detail data for development and testing
 * Extended task group data with descriptions for detail view
 */
export const sampleTaskGroupsDetail: TaskGroupDetailData[] = [
  {
    id: '1',
    name: 'Frontend Development',
    description: 'Development of user-facing components and interfaces for the e-commerce platform, including responsive design and user experience optimization.',
    projectId: 'proj-001',
    projectName: 'E-commerce Platform',
    taskCount: 15,
    status: 'active',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-02-20T14:30:00Z')
  },
  {
    id: '2',
    name: 'API Integration',
    description: 'Integration of third-party APIs and internal services to support e-commerce functionality including payment processing and inventory management.',
    projectId: 'proj-001',
    projectName: 'E-commerce Platform',
    taskCount: 0,
    status: 'active',
    createdAt: new Date('2024-01-20T09:15:00Z'),
    updatedAt: new Date('2024-02-18T16:45:00Z')
  }
];

/**
 * Helper function to get tasks by task group ID
 */
export const getTasksByTaskGroupId = (taskGroupId: string): Task[] => {
  return sampleTasks.filter(task => task.taskGroupId === taskGroupId);
};

/**
 * Helper function to get task group detail data by ID
 */
export const getTaskGroupDetailById = (id: string): TaskGroupDetailData | undefined => {
  return sampleTaskGroupsDetail.find(tg => tg.id === id);
};

/**
 * Helper function to get paginated tasks
 */
export const getPaginatedTasks = (
  tasks: Task[],
  page: number,
  itemsPerPage: number
): Task[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return tasks.slice(startIndex, endIndex);
};