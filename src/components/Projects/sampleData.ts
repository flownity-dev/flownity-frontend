import type { Project } from '../../types/common.types';

/**
 * Sample project data for initial development
 * Contains 2 sample rows covering different statuses and filter scenarios
 */
export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-30'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Legacy System Upgrade',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-12-15'),
    status: 'archived'
  }
];