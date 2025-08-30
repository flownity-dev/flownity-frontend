import type { Project, ProjectDetailData } from '../../types/common.types';

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

/**
 * Extended sample project data with additional detail fields for project detail view
 */
export const sampleProjectsDetail: ProjectDetailData[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design, improved user experience, and mobile responsiveness. This project includes user research, wireframing, design system creation, and full development implementation.',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-30'),
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-15'),
    owner: 'Sarah Johnson'
  },
  {
    id: '2',
    name: 'Legacy System Upgrade',
    description: 'Migration of legacy backend systems to modern cloud infrastructure. Includes database migration, API modernization, security updates, and performance optimizations to support future growth.',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-12-15'),
    status: 'archived',
    createdAt: new Date('2023-07-20'),
    updatedAt: new Date('2023-12-15'),
    owner: 'Michael Chen'
  },
  {
    id: '3',
    name: 'Mobile App Development',
    description: 'Development of a cross-platform mobile application for iOS and Android. Features include user authentication, real-time notifications, offline capabilities, and integration with existing web services.',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-08-15'),
    status: 'active',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-10'),
    owner: 'Alex Rodriguez'
  }
];