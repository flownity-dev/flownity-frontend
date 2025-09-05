import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { LoadingState, ErrorState } from '../Common';
import TaskGroupDetailHeader from './TaskGroupDetailHeader';
import TasksTable from './TasksTable';
import TasksPagination from './TasksPagination';
import {
    getTaskGroupDetailById,
    getTasksByTaskGroupId,
    getPaginatedTasks,
    getTotalPages
} from './sampleData';
import type {
    TaskGroupDetailViewProps,
    TaskGroupDetailData,
    Task
} from '../../types/common.types';

const ITEMS_PER_PAGE = 10;

/**
 * Main container component for task group detail view
 * Handles URL parameter extraction, data loading, and state management
 */
const TaskGroupDetailView: React.FC<TaskGroupDetailViewProps> = ({ className }) => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // State management
    const [taskGroup, setTaskGroup] = useState<TaskGroupDetailData | null>(null);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Data loading effect
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!id) {
                    throw new Error('Task group ID is required');
                }

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Get task group detail data
                const taskGroupData = getTaskGroupDetailById(id);
                if (!taskGroupData) {
                    throw new Error('Task group not found');
                }

                // Get tasks for this task group
                const tasks = getTasksByTaskGroupId(id);

                setTaskGroup(taskGroupData);
                setAllTasks(tasks);

                // Calculate pagination
                const totalPagesCount = getTotalPages(tasks.length, ITEMS_PER_PAGE);
                setTotalPages(totalPagesCount);

                // Set initial page tasks
                const paginatedTasks = getPaginatedTasks(tasks, 1, ITEMS_PER_PAGE);
                setCurrentTasks(paginatedTasks);
                setCurrentPage(1);

            } catch (err) {
                console.error('Error loading task group data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load task group data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const paginatedTasks = getPaginatedTasks(allTasks, page, ITEMS_PER_PAGE);
        setCurrentTasks(paginatedTasks);
    };

    // Handle new task button click
    const handleNewTask = () => {
        console.log('New task functionality not implemented yet');
    };

    // Handle retry on error
    const handleRetry = () => {
        // Trigger data reload by updating a dependency
        setError(null);
        setLoading(true);
        // Re-trigger the useEffect by changing the key dependency
        window.location.reload();
    };

    // Loading state
    if (loading) {
        return (
            <Box className={className} sx={{ p: 3 }}>
                <LoadingState />
            </Box>
        );
    }

    // Error state
    if (error || !taskGroup) {
        return (
            <Box className={className} sx={{ p: 3 }}>
                <ErrorState
                    title="Failed to load task group"
                    description={error || 'Task group not found'}
                    onRetry={handleRetry}
                />
            </Box>
        );
    }

    return (
        <Box className={className}>
            {/* Task Group Header */}
            <TaskGroupDetailHeader
                taskGroup={taskGroup}
            />

            {/* Tasks Section */}
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* New Task Button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 2,
                        mb: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewTask}
                        sx={{
                            minWidth: { xs: 90, sm: 100 },
                            fontWeight: 600,
                        }}
                    >
                        New
                    </Button>
                </Box>

                {/* Tasks Table */}
                <TasksTable
                    tasks={currentTasks}
                    loading={false}
                    error={null}
                    onRetry={handleRetry}
                    isMobile={isMobile}
                    isTablet={isTablet}
                />

                {/* Pagination */}
                <TasksPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isMobile={isMobile}
                />
            </Box>
        </Box>
    );
};

export default TaskGroupDetailView;