import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Groups } from '@mui/icons-material';
import type { Project } from '../../types/common.types';

interface ProjectMembersProps {
    project: Project;
}

/**
 * ProjectMembers component for rendering project members content
 * Displays member cards and placeholder content
 */
export const ProjectMembers: React.FC<ProjectMembersProps> = ({ project }) => {
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
                    <Groups color="primary" />
                    Project Members
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
                    Manage team members and their roles for {project.name}
                </Typography>
            </Box>

            {/* Members Cards Grid */}
            <Grid 
                container 
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{ mb: { xs: 4, sm: 6 } }}
            >
                {/* Placeholder member cards */}
                {[
                    { name: 'John Doe', role: 'Project Manager', avatar: 'JD', status: 'Active' },
                    { name: 'Jane Smith', role: 'Lead Developer', avatar: 'JS', status: 'Active' },
                    { name: 'Mike Johnson', role: 'QA Engineer', avatar: 'MJ', status: 'Active' },
                    { name: 'Sarah Wilson', role: 'Designer', avatar: 'SW', status: 'Inactive' }
                ].map((member, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                        <Paper
                            elevation={1}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                transition: 'all 0.2s ease-in-out',
                                cursor: 'pointer',
                                '&:hover': {
                                    elevation: 4,
                                    transform: 'translateY(-4px)',
                                    boxShadow: (theme) => theme.shadows[4],
                                },
                                borderRadius: 2,
                                backgroundColor: 'background.paper',
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: 48, sm: 56 },
                                    height: { xs: 48, sm: 56 },
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'primary.contrastText',
                                    fontWeight: 600,
                                    fontSize: {
                                        xs: '1rem',   // 16px on mobile
                                        sm: '1.2rem', // 19.2px on tablet+
                                    },
                                    mb: { xs: 1.5, sm: 2 },
                                }}
                            >
                                {member.avatar}
                            </Box>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 0.5, 
                                    fontWeight: 600,
                                    fontSize: {
                                        xs: '1rem',     // 16px on mobile
                                        sm: '1.125rem', // 18px on tablet+
                                    },
                                }}
                            >
                                {member.name}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                    mb: 2,
                                    fontSize: {
                                        xs: '0.75rem', // 12px on mobile
                                        sm: '0.875rem', // 14px on tablet+
                                    },
                                }}
                            >
                                {member.role}
                            </Typography>
                            <Chip
                                label={member.status}
                                size="small"
                                color={member.status === 'Active' ? 'success' : 'default'}
                                variant="outlined"
                                sx={{
                                    fontSize: {
                                        xs: '0.6875rem', // 11px on mobile
                                        sm: '0.75rem',   // 12px on tablet+
                                    },
                                }}
                            />
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
                <Groups 
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
                    Member Management Coming Soon
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
                    Team member management functionality will be available in a future update.
                </Typography>
            </Box>
        </Box>
    );
};