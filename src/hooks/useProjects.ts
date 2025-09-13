import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllProjects, type PaginationParams, type PaginatedResponse } from '../services/projectService';
import type { Project } from '../types/common.types';

export interface UseProjectsParams {
    page?: number;
    limit?: number;
    filter?: 'all' | 'archived';
}

export interface UseProjectsReturn {
    projects: Project[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    totalItems: number;
    refetch: () => void;
}

export const useProjects = (params: UseProjectsParams = {}): UseProjectsReturn => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);

    // Use ref to track the current request to enable cancellation
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchProjects = useCallback(async () => {
        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            const paginationParams: PaginationParams = {
                page: params.page || 1,
                limit: params.limit || 20,
                filter: params.filter || 'all'
            };

            const response: PaginatedResponse<Project> = await getAllProjects(paginationParams);

            // Check if request was cancelled
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }

            // Use backend-filtered data directly - no client-side filtering
            // Ensure we always have a valid array
            const projectsData = Array.isArray(response.data) ? response.data : [];
            setProjects(projectsData);
            setTotalPages(response.totalPages || 1);
            setCurrentPage(response.currentPage || 1);
            setTotalItems(response.totalItems || projectsData.length);
        } catch (err) {
            // Don't set error if request was cancelled
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }

            // Enhanced error handling for different error types
            let errorMessage = 'An unexpected error occurred while fetching projects';
            
            if (err instanceof Error) {
                if (err.name === 'AbortError') {
                    return; // Request was cancelled, don't set error
                }
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            } else if (err && typeof err === 'object' && 'message' in err) {
                errorMessage = String(err.message);
            }

            setError(errorMessage);

            // Reset data on error but preserve pagination state for retry
            setProjects([]);
            setTotalPages(1);
            setTotalItems(0);
        } finally {
            // Don't update loading state if request was cancelled
            if (!abortControllerRef.current?.signal.aborted) {
                setLoading(false);
            }
        }
    }, [params.page, params.limit, params.filter]);

    const refetch = useCallback(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Fetch projects on mount and when parameters change
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        projects,
        loading,
        error,
        totalPages,
        currentPage,
        totalItems,
        refetch
    };
};