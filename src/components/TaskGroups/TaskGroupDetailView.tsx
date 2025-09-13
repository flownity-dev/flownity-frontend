import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { LoadingState, ErrorState } from '../Common';
import TaskGroupDetailHeader from './TaskGroupDetailHeader';
import TasksTable from './TasksTable';
import TasksPagination from './TasksPagination';
import { getTaskGroupById } from '../../services/taskGroupService';
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

                // Get task group detail data from API
                const taskGroupData = await getTaskGroupById(id);
                setTaskGroup(taskGroupData);

                // For now, set empty tasks array until tasks API is implemented
                // TODO: Implement tasks fetching when tasks API is available
                const tasks: Task[] = [];
                setAllTasks(tasks);

                // Calculate pagination
                const totalPagesCount = Math.ceil(tasks.length / ITEMS_PER_PAGE);
                setTotalPages(totalPagesCount);

                // Set initial page tasks
                const startIndex = 0;
                const endIndex = ITEMS_PER_PAGE;
                const paginatedTasks = tasks.slice(startIndex, endIndex);
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
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedTasks = allTasks.slice(startIndex, endIndex);
        setCurrentTasks(paginatedTasks);
    };

    // Handle new task button click
    const handleNewTask = () => {
        console.log('New task functionality not implemented yet');
    };

    // Handle retry on error
    const handleRetry = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!id) {
                throw new Error('Task group ID is required');
            }

            // Retry fetching task group data
            const taskGroupData = await getTaskGroupById(id);
            setTaskGroup(taskGroupData);

            // Reset tasks (empty for now until tasks API is implemented)
            const tasks: Task[] = [];
            setAllTasks(tasks);
            setCurrentTasks(tasks.slice(0, ITEMS_PER_PAGE));
            setTotalPages(Math.ceil(tasks.length / ITEMS_PER_PAGE));
            setCurrentPage(1);

        } catch (err) {
            console.error('Error retrying task group data fetch:', err);
            setError(err instanceof Error ? err.message : 'Failed to load task group data');
        } finally {
            setLoading(false);
        }
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
