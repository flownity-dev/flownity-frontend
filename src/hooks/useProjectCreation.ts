import { useState, useCallback, useRef, useEffect } from 'react';
import { createProject as createProjectAPI } from '../services/projectService';
import type { CreateProjectFormData, Project } from '../types/common.types';

/**
 * Return type for the useProjectCreation hook
 */
export interface UseProjectCreationReturn {
    createProject: (data: CreateProjectFormData) => Promise<void>;
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook for handling project creation
 * 
 * @param onSuccess - Optional callback function called when project creation succeeds
 * @returns Object containing createProject function, loading state, and error state
 */
export const useProjectCreation = (
    onSuccess?: (project: Project) => void
): UseProjectCreationReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Track if component is mounted to prevent state updates after unmount
    const isMountedRef = useRef<boolean>(true);

    const handleCreateProject = useCallback(async (data: CreateProjectFormData) => {
        console.log('useProjectCreation: handleCreateProject called with:', data);

        try {
            if (!isMountedRef.current) return;

            console.log('useProjectCreation: Setting loading to true');
            setLoading(true);
            setError(null);

            // Validate form data before API call
            if (!data.name || data.name.trim().length === 0) {
                throw new Error('Project name is required');
            }

            if (data.name.trim().length > 100) {
                throw new Error('Project name must be less than 100 characters');
            }

            if (data.description && data.description.length > 500) {
                throw new Error('Project description must be less than 500 characters');
            }

            console.log('useProjectCreation: Calling createProject API...');
            // Call the API to create the project
            const newProject = await createProjectAPI(data);
            console.log('useProjectCreation: API call successful, new project:', newProject);

            // Check if component is still mounted before updating state or calling callbacks
            if (!isMountedRef.current) return;

            // Call success callback if provided
            if (onSuccess) {
                console.log('useProjectCreation: Calling onSuccess callback');
                onSuccess(newProject);
            }
        } catch (err) {
            // Only update state if component is still mounted
            if (!isMountedRef.current) return;

            // Enhanced error handling for different error types
            let errorMessage = 'Failed to create project';

            if (err instanceof Error) {
                if (err.message.includes('Network Error') || err.message.includes('timeout')) {
                    errorMessage = 'Network error: Please check your connection and try again';
                } else {
                    errorMessage = err.message;
                }
            } else if (typeof err === 'string') {
                errorMessage = err;
            } else if (err && typeof err === 'object' && 'message' in err) {
                errorMessage = String(err.message);
            }

            setError(errorMessage);
            throw err; // Re-throw to allow caller to handle if needed
        } finally {
            // Only update loading state if component is still mounted
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [onSuccess]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return {
        createProject: handleCreateProject,
        loading,
        error
    };
};

export default useProjectCreation;