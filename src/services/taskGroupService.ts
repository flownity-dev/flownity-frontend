import httpClient from '../http-common';
import type { TaskGroup, TaskGroupDetailData, CreateTaskGroupFormData } from '../types/common.types';
import { mapToTaskGroupStatus } from '../utils/statusMapper';

export interface UpdateTaskGroupData {
    name?: string;
    description?: string;
}

// Backend API response interface for TaskGroup
export interface ApiTaskGroup {
    id: number;
    task_group_title: string;
    project_id: number | string; // Can be either number or string
    status_id: number;
    status: string; // New status field from API
    due_from: string | null;
    due_to: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// Transform API response to frontend TaskGroup interface
export const transformApiTaskGroup = (apiTaskGroup: ApiTaskGroup): TaskGroup => {
    // Use status field for workflow status mapping
    const workflowStatus = mapToTaskGroupStatus(apiTaskGroup.status);
    
    return {
        id: apiTaskGroup.id.toString(),
        name: apiTaskGroup.task_group_title,
        projectId: apiTaskGroup.project_id.toString(),
        projectName: 'Unknown Project', // Will be populated by backend or separate call
        taskCount: 0, // Will be populated by backend or separate call
        status: workflowStatus,
        createdAt: new Date(apiTaskGroup.created_at),
        updatedAt: new Date(apiTaskGroup.updated_at),
        deleted_at: apiTaskGroup.deleted_at
    };
};

// Transform API response to frontend TaskGroupDetailData interface
export const transformApiTaskGroupDetail = (apiTaskGroup: ApiTaskGroup & { description?: string }): TaskGroupDetailData => {
    const baseTaskGroup = transformApiTaskGroup(apiTaskGroup);
    return {
        ...baseTaskGroup,
        description: apiTaskGroup.description || ''
    };
};

// Pagination and filtering parameters interface for TaskGroups
export interface TaskGroupPaginationParams {
    page?: number;
    limit?: number;
    filter?: 'all' | 'archived';
}

// GET /api/v1/task-groups - Get all task groups for authenticated user
export const getAllTaskGroups = async (params?: TaskGroupPaginationParams): Promise<TaskGroup[]> => {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams();

        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params?.filter) {
            queryParams.append('filter', params.filter);
        }

        const url = queryParams.toString()
            ? `/task-groups?${queryParams.toString()}`
            : '/task-groups';

        const response = await httpClient.get(url);
        // Handle different possible response formats
        if (Array.isArray(response.data)) {
            // Direct array response
            const apiTaskGroups: ApiTaskGroup[] = response.data;
            
            // Filter based on deleted_at field and filter parameter
            let filteredTaskGroups = apiTaskGroups;
            if (params?.filter === 'archived') {
                // Show only archived items (deleted_at is not null)
                filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at !== null);
            } else {
                // Show only active items (deleted_at is null) - this is the default for 'all'
                filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at === null);
            }
            
            return filteredTaskGroups.map(transformApiTaskGroup);
        }

        // Handle nested response structure
        if (response.data && typeof response.data === 'object') {
            // Check for success response with data
            if (response.data.success && response.data.data) {
                const taskGroupsData = response.data.data;

                // Check if task groups are nested under a 'taskGroups' key (based on actual API response)
                if (taskGroupsData.taskGroups && Array.isArray(taskGroupsData.taskGroups)) {
                    const apiTaskGroups: ApiTaskGroup[] = taskGroupsData.taskGroups;
                    
                    // Filter based on deleted_at field and filter parameter
                    let filteredTaskGroups = apiTaskGroups;
                    if (params?.filter === 'archived') {
                        // Show only archived items (deleted_at is not null)
                        filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at !== null);
                    } else {
                        // Show only active items (deleted_at is null) - this is the default for 'all'
                        filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at === null);
                    }
                    
                    return filteredTaskGroups.map(transformApiTaskGroup);
                }

                // Check if task groups are nested under a 'task_groups' key
                if (taskGroupsData.task_groups && Array.isArray(taskGroupsData.task_groups)) {
                    const apiTaskGroups: ApiTaskGroup[] = taskGroupsData.task_groups;
                    
                    // Filter based on deleted_at field and filter parameter
                    let filteredTaskGroups = apiTaskGroups;
                    if (params?.filter === 'archived') {
                        // Show only archived items (deleted_at is not null)
                        filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at !== null);
                    } else {
                        // Show only active items (deleted_at is null) - this is the default for 'all'
                        filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at === null);
                    }
                    
                    return filteredTaskGroups.map(transformApiTaskGroup);
                }

                if (Array.isArray(taskGroupsData)) {
                    const apiTaskGroups: ApiTaskGroup[] = taskGroupsData;
                    
                    // Filter based on deleted_at field and filter parameter
                    let filteredTaskGroups = apiTaskGroups;
                    if (params?.filter === 'archived') {
                        // Show only archived items (deleted_at is not null)
                        filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at !== null);
                    } else {
                        // Show only active items (deleted_at is null) - this is the default for 'all'
                        filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at === null);
                    }
                    
                    return filteredTaskGroups.map(transformApiTaskGroup);
                }
            }

            // Fallback: check if response.data has a 'data' property that's an array
            if ('data' in response.data && Array.isArray(response.data.data)) {
                const apiTaskGroups: ApiTaskGroup[] = response.data.data;
                
                // Filter based on deleted_at field and filter parameter
                let filteredTaskGroups = apiTaskGroups;
                if (params?.filter === 'archived') {
                    // Show only archived items (deleted_at is not null)
                    filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at !== null);
                } else {
                    // Show only active items (deleted_at is null) - this is the default for 'all'
                    filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at === null);
                }
                
                return filteredTaskGroups.map(transformApiTaskGroup);
            }

            // Check for common property names that might contain the task groups array
            const possibleArrayKeys = ['task_groups', 'taskGroups', 'items', 'results'];
            for (const key of possibleArrayKeys) {
                if (key in response.data && Array.isArray(response.data[key])) {
                    const apiTaskGroups: ApiTaskGroup[] = response.data[key];
                    
                    // Filter based on deleted_at field and filter parameter
                    let filteredTaskGroups = apiTaskGroups;
                    if (params?.filter === 'archived') {
                        // Show only archived items (deleted_at is not null)
                        filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at !== null);
                    } else {
                        // Show only active items (deleted_at is null) - this is the default for 'all'
                        filteredTaskGroups = apiTaskGroups.filter(taskGroup => taskGroup.deleted_at === null);
                    }
                    
                    return filteredTaskGroups.map(transformApiTaskGroup);
                }
            }

            // If we can't find the task groups array, log the structure and return empty
            console.error('Could not find task groups array in response structure:', response.data);
            return [];
        }

        // Fallback for unexpected response format
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
    } catch (error) {
        // Enhanced error handling
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;

            if (status === 404) {
                throw new Error('Task groups endpoint not found');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while fetching task groups');
            } else if (httpError.response?.data?.message) {
                throw new Error(httpError.response.data.message);
            }
        }

        if (error instanceof Error) {
            if (error.message.includes('Network Error') || error.message.includes('timeout')) {
                throw new Error('Network error: Please check your connection and try again');
            }
            throw error;
        }

        throw new Error('An unexpected error occurred while fetching task groups');
    }
};

// GET /api/v1/task-groups/trash - Get all soft deleted task groups
export const getTrashedTaskGroups = async (): Promise<TaskGroup[]> => {
    try {
        const response = await httpClient.get('/task-groups/trash');

        // Handle different possible response formats
        if (Array.isArray(response.data)) {
            // Direct array response
            const apiTaskGroups: ApiTaskGroup[] = response.data;
            return apiTaskGroups.map(transformApiTaskGroup);
        }

        // Handle nested response structure (similar to getAllTaskGroups)
        if (response.data && typeof response.data === 'object') {
            if (response.data.success && response.data.data) {
                const taskGroupsData = response.data.data;

                // Check if task groups are nested under a 'taskGroups' key (based on actual API response)
                if (taskGroupsData.taskGroups && Array.isArray(taskGroupsData.taskGroups)) {
                    const apiTaskGroups: ApiTaskGroup[] = taskGroupsData.taskGroups;
                    return apiTaskGroups.map(transformApiTaskGroup);
                }

                if (taskGroupsData.task_groups && Array.isArray(taskGroupsData.task_groups)) {
                    const apiTaskGroups: ApiTaskGroup[] = taskGroupsData.task_groups;
                    return apiTaskGroups.map(transformApiTaskGroup);
                }

                if (Array.isArray(taskGroupsData)) {
                    const apiTaskGroups: ApiTaskGroup[] = taskGroupsData;
                    return apiTaskGroups.map(transformApiTaskGroup);
                }
            }

            if ('data' in response.data && Array.isArray(response.data.data)) {
                const apiTaskGroups: ApiTaskGroup[] = response.data.data;
                return apiTaskGroups.map(transformApiTaskGroup);
            }

            const possibleArrayKeys = ['task_groups', 'taskGroups', 'items', 'results'];
            for (const key of possibleArrayKeys) {
                if (key in response.data && Array.isArray(response.data[key])) {
                    const apiTaskGroups: ApiTaskGroup[] = response.data[key];
                    return apiTaskGroups.map(transformApiTaskGroup);
                }
            }

            console.error('Could not find task groups array in response structure:', response.data);
            return [];
        }

        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;

            if (status === 404) {
                throw new Error('Trashed task groups endpoint not found');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while fetching trashed task groups');
            } else if (httpError.response?.data?.message) {
                throw new Error(httpError.response.data.message);
            }
        }

        if (error instanceof Error) {
            if (error.message.includes('Network Error') || error.message.includes('timeout')) {
                throw new Error('Network error: Please check your connection and try again');
            }
            throw error;
        }

        throw new Error('An unexpected error occurred while fetching trashed task groups');
    }
};

// GET /api/v1/task-groups/:id - Get a specific task group by ID
export const getTaskGroupById = async (id: string): Promise<TaskGroupDetailData> => {
    try {
        const response = await httpClient.get(`/task-groups/${id}`);

        // Handle the API response format
        if (response.data && typeof response.data === 'object') {
            // Check for success response with data
            if (response.data.success && response.data.data) {
                let apiTaskGroup = response.data.data;

                // Check if the task group is nested under a 'task_group' key
                if (apiTaskGroup.task_group && typeof apiTaskGroup.task_group === 'object') {
                    apiTaskGroup = apiTaskGroup.task_group;
                }

                return transformApiTaskGroupDetail(apiTaskGroup);
            }

            // Fallback: check if response.data is the task group directly
            if ('id' in response.data && 'task_group_title' in response.data) {
                return transformApiTaskGroupDetail(response.data);
            }
        }

        throw new Error('Invalid response format from get task group API');
    } catch (error) {
        // Enhanced error handling
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;

            if (status === 404) {
                throw new Error('Task group not found');
            } else if (status === 401) {
                throw new Error('Authentication required to view task group');
            } else if (status === 403) {
                throw new Error('You do not have permission to view this task group');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while fetching task group');
            } else if (httpError.response?.data?.message) {
                throw new Error(httpError.response.data.message);
            }
        }

        if (error instanceof Error) {
            if (error.message.includes('Network Error') || error.message.includes('timeout')) {
                throw new Error('Network error: Please check your connection and try again');
            }
            throw error;
        }

        throw new Error('An unexpected error occurred while fetching the task group');
    }
};

// POST /api/v1/task-groups - Create a new task group
export const createTaskGroup = async (data: CreateTaskGroupFormData): Promise<TaskGroup> => {
    try {
        const response = await httpClient.post('/task-groups', data);

        // Handle the API response format
        if (response.data && typeof response.data === 'object') {
            // Check for success response with data
            if (response.data.success && response.data.data) {
                let apiTaskGroup = response.data.data;

                // Check if the task group is nested under a 'task_group' key
                if (apiTaskGroup.task_group && typeof apiTaskGroup.task_group === 'object') {
                    apiTaskGroup = apiTaskGroup.task_group;
                }

                // Validate that we have the required fields
                if (!apiTaskGroup || typeof apiTaskGroup !== 'object') {
                    throw new Error('Invalid task group data in API response');
                }

                // Check if the task group has an id field
                if (!apiTaskGroup.id) {
                    throw new Error('Task group data missing ID field');
                }

                return transformApiTaskGroup(apiTaskGroup as ApiTaskGroup);
            }

            // Fallback: check if response.data is the task group directly
            if ('id' in response.data && 'task_group_title' in response.data) {
                const apiTaskGroup = response.data as ApiTaskGroup;
                return transformApiTaskGroup(apiTaskGroup);
            }
        }

        throw new Error('Invalid response format from create task group API');
    } catch (error) {
        // Enhanced error handling
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;

            if (status === 400) {
                throw new Error('Invalid task group data provided');
            } else if (status === 401) {
                throw new Error('Authentication required to create task group');
            } else if (status === 403) {
                throw new Error('You do not have permission to create task groups');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while creating task group');
            } else if (httpError.response?.data?.message) {
                throw new Error(httpError.response.data.message);
            }
        }

        if (error instanceof Error) {
            if (error.message.includes('Network Error') || error.message.includes('timeout')) {
                throw new Error('Network error: Please check your connection and try again');
            }
            throw error;
        }

        throw new Error('An unexpected error occurred while creating the task group');
    }
};

// PUT /api/v1/task-groups/:id - Update a task group
export const updateTaskGroup = async (id: string, data: UpdateTaskGroupData): Promise<TaskGroup> => {
    try {
        const response = await httpClient.put(`/task-groups/${id}`, data);

        // Handle the API response format
        if (response.data && typeof response.data === 'object') {
            // Check for success response with data
            if (response.data.success && response.data.data) {
                let apiTaskGroup = response.data.data;

                if (apiTaskGroup.task_group && typeof apiTaskGroup.task_group === 'object') {
                    apiTaskGroup = apiTaskGroup.task_group;
                }

                return transformApiTaskGroup(apiTaskGroup as ApiTaskGroup);
            }

            // Fallback: check if response.data is the task group directly
            if ('id' in response.data && 'task_group_title' in response.data) {
                return transformApiTaskGroup(response.data as ApiTaskGroup);
            }
        }

        throw new Error('Invalid response format from update task group API');
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;

            if (status === 404) {
                throw new Error('Task group not found');
            } else if (status === 400) {
                throw new Error('Invalid task group data provided');
            } else if (status === 401) {
                throw new Error('Authentication required to update task group');
            } else if (status === 403) {
                throw new Error('You do not have permission to update this task group');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while updating task group');
            } else if (httpError.response?.data?.message) {
                throw new Error(httpError.response.data.message);
            }
        }

        if (error instanceof Error) {
            if (error.message.includes('Network Error') || error.message.includes('timeout')) {
                throw new Error('Network error: Please check your connection and try again');
            }
            throw error;
        }

        throw new Error('An unexpected error occurred while updating the task group');
    }
};

// DELETE /api/v1/task-groups/:id - Soft delete a task group
export const deleteTaskGroup = async (id: string): Promise<void> => {
    await httpClient.delete(`/task-groups/${id}`);
};

// POST /api/v1/task-groups/:id/restore - Restore a soft deleted task group
export const restoreTaskGroup = async (id: string): Promise<TaskGroup> => {
    try {
        const response = await httpClient.post(`/task-groups/${id}/restore`);

        // Handle the API response format
        if (response.data && typeof response.data === 'object') {
            // Check for success response with data
            if (response.data.success && response.data.data) {
                let apiTaskGroup = response.data.data;

                if (apiTaskGroup.task_group && typeof apiTaskGroup.task_group === 'object') {
                    apiTaskGroup = apiTaskGroup.task_group;
                }

                return transformApiTaskGroup(apiTaskGroup as ApiTaskGroup);
            }

            // Fallback: check if response.data is the task group directly
            if ('id' in response.data && 'task_group_title' in response.data) {
                return transformApiTaskGroup(response.data as ApiTaskGroup);
            }
        }

        throw new Error('Invalid response format from restore task group API');
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;

            if (status === 404) {
                throw new Error('Task group not found');
            } else if (status === 401) {
                throw new Error('Authentication required to restore task group');
            } else if (status === 403) {
                throw new Error('You do not have permission to restore this task group');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while restoring task group');
            } else if (httpError.response?.data?.message) {
                throw new Error(httpError.response.data.message);
            }
        }

        if (error instanceof Error) {
            if (error.message.includes('Network Error') || error.message.includes('timeout')) {
                throw new Error('Network error: Please check your connection and try again');
            }
            throw error;
        }

        throw new Error('An unexpected error occurred while restoring the task group');
    }
};

// DELETE /api/v1/task-groups/:id/force - Permanently delete a task group
export const forceDeleteTaskGroup = async (id: string): Promise<void> => {
    await httpClient.delete(`/task-groups/${id}/force`);
};