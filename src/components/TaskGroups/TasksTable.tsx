import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    Box,
    Chip,
    useTheme,
} from '@mui/material';
import { Task as TaskIcon } from '@mui/icons-material';
import type { TasksTableProps, Task, TaskStatus } from '../../types/common.types';
import { LoadingState, EmptyState, ErrorState } from '../Common';

/**
 * Get status chip color based on task status
 */
const getStatusChipColor = (status: TaskStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
        case 'new':
            return 'info';
        case 'in-progress':
            return 'warning';
        case 'completed':
            return 'success';
        case 'close':
            return 'default';
        default:
            return 'default';
    }
};

/**
 * Get status display label
 */
const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
        case 'new':
            return 'New';
        case 'in-progress':
            return 'In Progress';
        case 'completed':
            return 'Completed';
        case 'close':
            return 'Closed';
        default:
            return status;
    }
};

/**
 * Format date for display
 */
const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const TasksTable: React.FC<TasksTableProps> = ({ 
    tasks, 
    loading = false, 
    error = null, 
    onRetry,
    isMobile = false,
    isTablet = false,
}) => {
    const theme = useTheme();

    /**
     * Mobile card view for tasks
     */
    const MobileTaskCard: React.FC<{ task: Task }> = ({ task }) => (
        <Card 
            sx={{ 
                mb: 2,
                '&:hover': {
                    boxShadow: theme.shadows[4],
                },
                transition: theme.transitions.create(['box-shadow'], {
                    duration: theme.transitions.duration.short,
                }),
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                    {/* Task name and status */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                            {task.name}
                        </Typography>
                        <Chip
                            label={getStatusLabel(task.status)}
                            color={getStatusChipColor(task.status)}
                            size="small"
                            variant="filled"
                        />
                    </Box>
                    
                    {/* Task details */}
                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                Deadline:
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {formatDate(task.deadlineDate)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                Assignee:
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {task.assignee}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                Approver:
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {task.approver}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );

    // Handle loading state
    if (loading) {
        return (
            <Paper sx={{ boxShadow: 1, borderRadius: 1 }}>
                <LoadingState 
                    message="Loading tasks..." 
                    size="medium" 
                />
            </Paper>
        );
    }

    // Handle error state
    if (error) {
        return (
            <Paper sx={{ boxShadow: 1, borderRadius: 1 }}>
                <ErrorState
                    title="Failed to load tasks"
                    description={error}
                    onRetry={onRetry}
                    showRetry={!!onRetry}
                />
            </Paper>
        );
    }

    // Handle empty state
    if (tasks.length === 0) {
        return (
            <Paper sx={{ boxShadow: 1, borderRadius: 1 }}>
                <EmptyState
                    title="No tasks found"
                    description="There are no tasks in this task group yet. Create a new task to get started."
                    icon={TaskIcon}
                />
            </Paper>
        );
    }

    // Mobile card layout
    if (isMobile) {
        return (
            <Box>
                {tasks.map((task) => (
                    <MobileTaskCard key={task.id} task={task} />
                ))}
            </Box>
        );
    }

    // Desktop/tablet table layout
    return (
        <TableContainer
            component={Paper}
            sx={{
                boxShadow: 1,
                borderRadius: 1,
                overflowX: 'auto',
            }}
        >
            <Table 
                sx={{ 
                    minWidth: isTablet ? 600 : 800,
                }} 
                aria-label="tasks table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Deadline Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Assignee
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Approver
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Status
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow
                            key={task.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                                transition: theme.transitions.create(['background-color'], {
                                    duration: theme.transitions.duration.short,
                                }),
                            }}
                        >
                            <TableCell component="th" scope="row">
                                <Typography variant="body2" fontWeight={500}>
                                    {task.name}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(task.deadlineDate)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.primary">
                                    {task.assignee}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.primary">
                                    {task.approver}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getStatusLabel(task.status)}
                                    color={getStatusChipColor(task.status)}
                                    size="small"
                                    variant="filled"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TasksTable;
