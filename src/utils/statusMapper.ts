import type { ProjectStatus, TaskGroupStatus } from '../types/common.types';

/**
 * All possible API status values
 */
export type ApiStatus = 
  | "backlog"
  | "todo" 
  | "in-progress"
  | "in-review"
  | "blocked"
  | "on-hold"
  | "done"
  | "closed"
  | "cancelled";

/**
 * Maps API status string to ProjectStatus
 */
export const mapToProjectStatus = (status: string | null | undefined): ProjectStatus => {
  if (!status || typeof status !== 'string') {
    return 'active'; // Default for null/undefined status
  }
  
  const normalizedStatus = status.toLowerCase().trim() as ApiStatus;
  
  switch (normalizedStatus) {
    case 'backlog':
    case 'todo':
      return 'active';
    case 'in-progress':
    case 'in-review':
    case 'blocked':
    case 'on-hold':
      return 'on-hold';
    case 'done':
      return 'completed';
    case 'closed':
    case 'cancelled':
      return 'archived';
    default:
      // Default to active for unknown statuses
      return 'active';
  }
};

/**
 * Maps API status string to TaskGroupStatus
 */
export const mapToTaskGroupStatus = (status: string | null | undefined): TaskGroupStatus => {
  if (!status || typeof status !== 'string') {
    return 'active'; // Default for null/undefined status
  }
  
  const normalizedStatus = status.toLowerCase().trim() as ApiStatus;
  
  switch (normalizedStatus) {
    case 'backlog':
    case 'todo':
    case 'in-progress':
    case 'in-review':
    case 'blocked':
    case 'on-hold':
      return 'active';
    case 'done':
    case 'closed':
    case 'cancelled':
      return 'archived';
    default:
      // Default to active for unknown statuses
      return 'active';
  }
};