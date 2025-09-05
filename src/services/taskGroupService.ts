import httpClient from '../http-common';
import type { TaskGroup, CreateTaskGroupFormData } from '../types/common.types';

export interface UpdateTaskGroupData {
    name?: string;
    description?: string;
}

// GET /api/v1/task-groups - Get all task groups for authenticated user
export const getAllTaskGroups = async (): Promise<TaskGroup[]> => {
    const response = await httpClient.get('/task-groups');
    return response.data;
};

// GET /api/v1/task-groups/trash - Get all soft deleted task groups
export const getTrashedTaskGroups = async (): Promise<TaskGroup[]> => {
    const response = await httpClient.get('/task-groups/trash');
    return response.data;
};

// GET /api/v1/task-groups/:id - Get a specific task group by ID
export const getTaskGroupById = async (id: string): Promise<TaskGroup> => {
    const response = await httpClient.get(`/task-groups/${id}`);
    return response.data;
};

// POST /api/v1/task-groups - Create a new task group
export const createTaskGroup = async (data: CreateTaskGroupFormData): Promise<TaskGroup> => {
    const response = await httpClient.post('/task-groups', data);
    return response.data;
};

// PUT /api/v1/task-groups/:id - Update a task group
export const updateTaskGroup = async (id: string, data: UpdateTaskGroupData): Promise<TaskGroup> => {
    const response = await httpClient.put(`/task-groups/${id}`, data);
    return response.data;
};

// DELETE /api/v1/task-groups/:id - Soft delete a task group
export const deleteTaskGroup = async (id: string): Promise<void> => {
    await httpClient.delete(`/task-groups/${id}`);
};

// POST /api/v1/task-groups/:id/restore - Restore a soft deleted task group
export const restoreTaskGroup = async (id: string): Promise<TaskGroup> => {
    const response = await httpClient.post(`/task-groups/${id}/restore`);
    return response.data;
};

// DELETE /api/v1/task-groups/:id/force - Permanently delete a task group
export const forceDeleteTaskGroup = async (id: string): Promise<void> => {
    await httpClient.delete(`/task-groups/${id}/force`);
};