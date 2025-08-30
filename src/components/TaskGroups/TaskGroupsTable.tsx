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
    useTheme,
} from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import type { TaskGroupsTableProps, TaskGroup } from '../../types/common.types';
import { LoadingState, EmptyState, ErrorState } from '../Common';

const TaskGroupsTable: React.FC<TaskGroupsTableProps> = ({ 
    taskGroups, 
    loading = false, 
    error = null, 
    onRetry,
    isMobile = false,
    isTablet = false,
}) => {
    const theme = useTheme();

    /**
     * Mobile card view for task groups
     */
    const MobileTaskGroupCard: React.FC<{ taskGroup: TaskGroup }> = ({ taskGroup }) => (
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
                    {/* Task Group name */}
                    <Typography variant="h6" fontWeight={600}>
                        {taskGroup.name}
                    </Typography>
                    
                    {/* Project and task count */}
                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                Project:
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {taskGroup.projectName}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                No. of Tasks:
                            </Typography>
                            <Typography variant="body2" color="text.primary" fontWeight={600}>
                                {taskGroup.taskCount}
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
                    message="Loading task groups..." 
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
                    title="Failed to load task groups"
                    description={error}
                    onRetry={onRetry}
                    showRetry={!!onRetry}
                />
            </Paper>
        );
    }

    // Handle empty state
    if (taskGroups.length === 0) {
        return (
            <Paper sx={{ boxShadow: 1, borderRadius: 1 }}>
                <EmptyState
                    title="No task groups found"
                    description="There are no task groups matching your current filter. Try adjusting your filters or create a new task group to get started."
                    icon={AssignmentIcon}
                />
            </Paper>
        );
    }

    // Mobile card layout
    if (isMobile) {
        return (
            <Box>
                {taskGroups.map((taskGroup) => (
                    <MobileTaskGroupCard key={taskGroup.id} taskGroup={taskGroup} />
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
                    minWidth: isTablet ? 500 : 650,
                }} 
                aria-label="task groups table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Task Group Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Project
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            No. of Tasks
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {taskGroups.map((taskGroup) => (
                        <TableRow
                            key={taskGroup.id}
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
                                    {taskGroup.name}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {taskGroup.projectName}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.primary" fontWeight={600}>
                                    {taskGroup.taskCount}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TaskGroupsTable;