import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Assignment } from '@mui/icons-material';
import type { Project } from '../../types/common.types';

interface ProjectTaskGroupsProps {
    project: Project;
}

/**
 * ProjectTaskGroups component for rendering task groups content
 * Displays task group cards and placeholder content
 */
export const ProjectTaskGroups: React.FC<ProjectTaskGroupsProps> = ({ project }) => {
    return (
        <Box sx={{ width: '100%' }}>
            {/* Section Header */}
            <Box 
                sx={{ 
                    mb: { xs: 3, sm: 4 },
                    pb: { xs: 2, sm: 3 },
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Typography 
                    variant="h5" 
                    sx={{ 
                        mb: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        fontWeight: 600,
                        fontSize: {
                            xs: '1.25rem', // 20px on mobile
                            sm: '1.5rem',  // 24px on tablet+
                        },
                    }}
                >
                    <Assignment color="primary" />
                    Task Groups
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                        fontSize: {
                            xs: '0.875rem', // 14px on mobile
                            sm: '1rem',     // 16px on tablet+
                        },
                        lineHeight: 1.6,
                    }}
                >
                    Organize and manage task groups for {project.name}
                </Typography>
            </Box>

            {/* Task Group Cards Grid */}
            <Grid 
                container 
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{ mb: { xs: 4, sm: 6 } }}
            >
                {/* Placeholder task group cards */}
                {[
                    { name: 'Development Tasks', count: 8, status: 'In Progress' },
                    { name: 'Testing & QA', count: 5, status: 'Pending' },
                    { name: 'Documentation', count: 3, status: 'Completed' }
                ].map((group, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                        <Paper
                            elevation={1}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease-in-out',
                                cursor: 'pointer',
                                '&:hover': {
                                    elevation: 4,
                                    transform: 'translateY(-4px)',
                                    boxShadow: (theme: any) => theme.shadows[4],
                                },
                                borderRadius: 2,
                                backgroundColor: 'background.paper',
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 1, 
                                    fontWeight: 600,
                                    fontSize: {
                                        xs: '1rem',     // 16px on mobile
                                        sm: '1.125rem', // 18px on tablet+
                                    },
                                }}
                            >
                                {group.name}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                    mb: 2, 
                                    flex: 1,
                                    fontSize: {
                                        xs: '0.75rem', // 12px on mobile
                                        sm: '0.875rem', // 14px on tablet+
                                    },
                                }}
                            >
                                {group.count} tasks in this group
                            </Typography>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                }}
                            >
                                <Chip
                                    label={group.status}
                                    size="small"
                                    color={
                                        group.status === 'Completed' ? 'success' :
                                            group.status === 'In Progress' ? 'primary' : 'default'
                                    }
                                    variant="outlined"
                                    sx={{
                                        fontSize: {
                                            xs: '0.6875rem', // 11px on mobile
                                            sm: '0.75rem',   // 12px on tablet+
                                        },
                                    }}
                                />
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{
                                        fontSize: {
                                            xs: '0.6875rem', // 11px on mobile
                                            sm: '0.75rem',   // 12px on tablet+
                                        },
                                    }}
                                >
                                    {group.count} tasks
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Empty state message */}
            <Box
                sx={{
                    p: { xs: 3, sm: 4, md: 6 },
                    textAlign: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    maxWidth: 600,
                    mx: 'auto',
                }}
            >
                <Assignment 
                    sx={{ 
                        fontSize: { xs: 40, sm: 48 }, 
                        color: 'text.secondary', 
                        mb: 2 
                    }} 
                />
                <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 1,
                        fontSize: {
                            xs: '1rem',     // 16px on mobile
                            sm: '1.125rem', // 18px on tablet+
                        },
                    }}
                >
                    Task Groups Coming Soon
                </Typography>
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                        fontSize: {
                            xs: '0.875rem', // 14px on mobile
                            sm: '1rem',     // 16px on tablet+
                        },
                        lineHeight: 1.5,
                    }}
                >
                    Task group management functionality will be available in a future update.
                </Typography>
            </Box>
        </Box>
    );
};
