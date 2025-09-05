import httpClient from '../http-common';
import type { Project, CreateProjectFormData } from '../types/common.types';

export interface UpdateProjectData {
    name?: string;
    description?: string;
}

export interface ProjectFlowData {
    // Define based on your actual flow data structure
    nodes: any[];
    edges: any[];
}

// GET /api/v1/projects - Get all projects for authenticated user
export const getAllProjects = async (): Promise<Project[]> => {
    const response = await httpClient.get('/projects');
    return response.data;
};

// GET /api/v1/projects/trash - Get all soft deleted projects
export const getTrashedProjects = async (): Promise<Project[]> => {
    const response = await httpClient.get('/projects/trash');
    return response.data;
};

// GET /api/v1/projects/:id - Get a specific project by ID
export const getProjectById = async (id: string): Promise<Project> => {
    const response = await httpClient.get(`/projects/${id}`);
    return response.data;
};

// POST /api/v1/projects - Create a new project
export const createProject = async (data: CreateProjectFormData): Promise<Project> => {
    const response = await httpClient.post('/projects', data);
    return response.data;
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