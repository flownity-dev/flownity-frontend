import httpClient from '../http-common';
import type { Project, CreateProjectFormData, ProjectStatus } from '../types/common.types';

// API response project interface (what the backend returns)
interface ApiProject {
    id: number;
    project_title: string;
    project_description: string;
    created_by: number;
    status_id: number | null;
    created_at: string;
    updated_at: string;
    start_date?: string;
    end_date?: string;
}

// Transform API project to frontend Project type
const transformApiProject = (apiProject: any): Project => {
    // Handle different possible ID field names
    const projectId = apiProject.id || apiProject.project_id;
    if (!projectId) {
        throw new Error('Project data missing ID field');
    }

    // Map status_id to ProjectStatus (you may need to adjust this mapping based on your backend)
    let status: ProjectStatus = 'active'; // default
    if (apiProject.status_id === 1) status = 'active';
    else if (apiProject.status_id === 2) status = 'completed';
    else if (apiProject.status_id === 3) status = 'on-hold';
    else if (apiProject.status_id === 4) status = 'archived';

    return {
        id: projectId.toString(),
        name: apiProject.project_title || apiProject.name || 'Untitled Project',
        startDate: apiProject.start_date ? new Date(apiProject.start_date) : new Date(apiProject.created_at || Date.now()),
        endDate: apiProject.end_date ? new Date(apiProject.end_date) : new Date(apiProject.updated_at || Date.now()),
        status
    };
};

export interface UpdateProjectData {
    name?: string;
    description?: string;
}

export interface ProjectFlowData {
    // Define based on your actual flow data structure
    nodes: unknown[];
    edges: unknown[];
}

// Pagination and filtering parameters interface
export interface PaginationParams {
    page?: number;
    limit?: number;
    filter?: 'all' | 'archived';
}

// Paginated response interface
export interface PaginatedResponse<T> {
    data: T[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}

// GET /api/v1/projects - Get all projects for authenticated user
export const getAllProjects = async (params?: PaginationParams): Promise<PaginatedResponse<Project>> => {
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

    const url = queryParams.toString() ? `/projects?${queryParams.toString()}` : '/projects';

    try {
        const response = await httpClient.get(url);

        // Handle both paginated and non-paginated responses for backward compatibility
        if (Array.isArray(response.data)) {
            // Non-paginated response - wrap in pagination structure
            return {
                data: response.data,
                totalPages: 1,
                currentPage: 1,
                totalItems: response.data.length
            };
        }



        // Handle the actual API response structure
        if (response.data && typeof response.data === 'object') {
            // Check for the expected API response structure: { success: true, data: { projects: [] }, pagination: {} }
            if (response.data.success && response.data.data && response.data.data.projects && Array.isArray(response.data.data.projects)) {
                const apiProjects = response.data.data.projects as ApiProject[];
                const transformedProjects = apiProjects.map(transformApiProject);
                const pagination = response.data.pagination || {};

                return {
                    data: transformedProjects,
                    totalPages: pagination.totalPages || 1,
                    currentPage: pagination.currentPage || 1,
                    totalItems: pagination.totalItems || transformedProjects.length
                };
            }

            // Fallback: check if response.data has a 'data' property with projects array
            if ('data' in response.data && response.data.data && 'projects' in response.data.data && Array.isArray(response.data.data.projects)) {
                const apiProjects = response.data.data.projects as ApiProject[];
                const transformedProjects = apiProjects.map(transformApiProject);
                const pagination = response.data.pagination || {};

                return {
                    data: transformedProjects,
                    totalPages: pagination.totalPages || 1,
                    currentPage: pagination.currentPage || 1,
                    totalItems: pagination.totalItems || transformedProjects.length
                };
            }

            // Legacy fallback: check if response.data has a 'data' property that's an array
            if ('data' in response.data && Array.isArray(response.data.data)) {
                const { data, totalPages: tp, currentPage: cp, totalItems: ti } = response.data;
                return {
                    data,
                    totalPages: tp || 1,
                    currentPage: cp || 1,
                    totalItems: ti || data.length
                };
            }

            // Another fallback: check for common property names that might contain the projects array
            const possibleArrayKeys = ['projects', 'items', 'results'];
            for (const key of possibleArrayKeys) {
                if (key in response.data && Array.isArray(response.data[key])) {
                    const projectsArray = response.data[key];
                    return {
                        data: projectsArray,
                        totalPages: response.data.totalPages || 1,
                        currentPage: response.data.currentPage || 1,
                        totalItems: response.data.totalItems || projectsArray.length
                    };
                }
            }

            // If we can't find the projects array, log the structure and return empty
            console.error('Could not find projects array in response structure:', response.data);
            return {
                data: [],
                totalPages: 1,
                currentPage: 1,
                totalItems: 0
            };
        }

        // Fallback for unexpected response format
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
    } catch (error) {
        // Enhanced error handling for network failures and invalid responses
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;
            if (status === 404) {
                throw new Error('Projects endpoint not found');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while fetching projects');
            } else if (httpError.response?.data?.message) {
                throw new Error(httpError.response.data.message);
            }
        }

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw error; // Re-throw abort errors as-is
            }
            if (error.message.includes('Network Error') || error.message.includes('timeout')) {
                throw new Error('Network error: Please check your connection and try again');
            }
            throw new Error(`Failed to fetch projects: ${error.message}`);
        }

        throw new Error('An unexpected error occurred while fetching projects');
    }
};

// GET /api/v1/projects/trash - Get all soft deleted projects
export const getTrashedProjects = async (): Promise<Project[]> => {
    const response = await httpClient.get('/projects/trash');
    return response.data;
};

// Transform API project response to ProjectDetailData
const transformApiProjectToDetail = (apiProject: any): import('../types/common.types').ProjectDetailData => {
    // Handle different possible ID field names
    const projectId = apiProject.id || apiProject.project_id;
    if (!projectId) {
        throw new Error('Project data missing ID field');
    }

    // Map status_id to ProjectStatus
    let status: ProjectStatus = 'active'; // default
    if (apiProject.status_id === 1) status = 'active';
    else if (apiProject.status_id === 2) status = 'completed';
    else if (apiProject.status_id === 3) status = 'on-hold';
    else if (apiProject.status_id === 4) status = 'archived';

    return {
        id: projectId.toString(),
        name: apiProject.project_title || 'Untitled Project',
        description: apiProject.project_description || '',
        status,
        startDate: apiProject.due_from ? new Date(apiProject.due_from) : new Date(apiProject.created_at),
        endDate: apiProject.due_to ? new Date(apiProject.due_to) : new Date(apiProject.updated_at),
        createdAt: new Date(apiProject.created_at),
        updatedAt: new Date(apiProject.updated_at),
        createdBy: apiProject.created_by,
        statusId: apiProject.status_id
    };
};

// GET /api/v1/projects/:id - Get a specific project by ID
export const getProjectById = async (id: string): Promise<import('../types/common.types').ProjectDetailData> => {
    try {
        const response = await httpClient.get(`/projects/${id}`);

        // Handle the API response format
        if (response.data && typeof response.data === 'object') {
            // Check for success response with data
            if (response.data.success && response.data.data) {
                let apiProject = response.data.data;

                // Check if the project is nested under a 'project' key
                if (apiProject.project && typeof apiProject.project === 'object') {
                    apiProject = apiProject.project;
                }

                return transformApiProjectToDetail(apiProject);
            }

            // Fallback: check if response.data is the project directly
            if ('id' in response.data && 'project_title' in response.data) {
                return transformApiProjectToDetail(response.data);
            }
        }

        throw new Error('Invalid response format from get project API');
    } catch (error) {
        // Enhanced error handling
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;

            if (status === 404) {
                throw new Error('Project not found');
            } else if (status === 401) {
                throw new Error('Authentication required to view project');
            } else if (status === 403) {
                throw new Error('You do not have permission to view this project');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while fetching project');
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

        throw new Error('An unexpected error occurred while fetching the project');
    }
};

// POST /api/v1/projects - Create a new project
export const createProject = async (data: CreateProjectFormData): Promise<Project> => {
    try {
        // Transform frontend form data to API format
        const apiData = {
            project_title: data.name,
            project_description: data.description || '',
            priority: data.priority,
        };

        const response = await httpClient.post('/projects', apiData);

        // Handle the API response format
        if (response.data && typeof response.data === 'object') {
            // Check for success response with data
            if (response.data.success && response.data.data) {
                let apiProject = response.data.data;

                // Check if the project is nested under a 'project' key
                if (apiProject.project && typeof apiProject.project === 'object') {
                    apiProject = apiProject.project;
                }

                // Validate that we have the required fields
                if (!apiProject || typeof apiProject !== 'object') {
                    throw new Error('Invalid project data in API response');
                }

                // Check if the project has an id field (try multiple possible field names)
                if (!apiProject.id && !apiProject.project_id && !apiProject.projectId) {
                    throw new Error('Project data missing ID field');
                }

                return transformApiProject(apiProject as ApiProject);
            }

            // Fallback: check if response.data is the project directly
            if ('id' in response.data && 'project_title' in response.data) {
                const apiProject = response.data as ApiProject;
                return transformApiProject(apiProject);
            }
        }

        throw new Error('Invalid response format from create project API');
    } catch (error) {
        // Enhanced error handling
        if (error && typeof error === 'object' && 'response' in error) {
            const httpError = error as { response?: { status?: number; data?: { message?: string } } };
            const status = httpError.response?.status;

            if (status === 400) {
                throw new Error('Invalid project data provided');
            } else if (status === 401) {
                throw new Error('Authentication required to create project');
            } else if (status === 403) {
                throw new Error('You do not have permission to create projects');
            } else if (status && status >= 500) {
                throw new Error('Server error occurred while creating project');
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

        throw new Error('An unexpected error occurred while creating the project');
    }
};

// PUT /api/v1/projects/:id - Update a project
export const updateProject = async (id: string, data: UpdateProjectData): Promise<Project> => {
    const response = await httpClient.put(`/projects/${id}`, data);
    return response.data;
};

// DELETE /api/v1/projects/:id - Soft delete a project
export const deleteProject = async (id: string): Promise<void> => {
    await httpClient.delete(`/projects/${id}`);
};

// POST /api/v1/projects/:id/restore - Restore a soft deleted project
export const restoreProject = async (id: string): Promise<Project> => {
    const response = await httpClient.post(`/projects/${id}/restore`);
    return response.data;
};

// DELETE /api/v1/projects/:id/force - Permanently delete a project
export const forceDeleteProject = async (id: string): Promise<void> => {
    await httpClient.delete(`/projects/${id}/force`);
};

// GET /api/v1/projects/project-flow/:project_id - Get project flow data
export const getProjectFlow = async (projectId: string): Promise<ProjectFlowData> => {
    const response = await httpClient.get(`/projects/project-flow/${projectId}`);
    return response.data;
};