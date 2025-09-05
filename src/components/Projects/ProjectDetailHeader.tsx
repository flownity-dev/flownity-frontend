import React from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { ChevronLeft, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { ProjectDetailData } from '../../types/common.types';

/**
 * Props interface for ProjectDetailHeader component
 */
export interface ProjectDetailHeaderProps {
    project: ProjectDetailData;
    onToggleSidebar: () => void;
    isSidebarCollapsed: boolean;
}

/**
 * Header component for project detail view
 * Displays project name, description, and action buttons
 */
export const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
    project,
    onToggleSidebar,
    isSidebarCollapsed
}) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/project');
    };

    const getStatusColor = (status: string): 'success' | 'primary' | 'warning' | 'default' => {
        switch (status) {
            case 'active':
                return 'success';
            case 'completed':
                return 'primary';
            case 'on-hold':
                return 'warning';
            case 'archived':
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                // Responsive padding
                p: {
                    xs: 2, // 16px on mobile
                    sm: 3, // 24px on tablet
                    md: 4, // 32px on desktop
                },
                // Responsive gap
                gap: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                },
                backgroundColor: 'background.paper',
                // Responsive flex direction for mobile
                flexDirection: {
                    xs: 'column',
                    sm: 'row',
                },
                alignItems: {
                    xs: 'stretch',
                    sm: 'flex-start',
                },
            }}
        >
            {/* Left section: Back button and project info */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 1, sm: 2 },
                    flex: 1,
                    minWidth: 0, // Prevent overflow
                }}
            >
                <IconButton
                    onClick={handleBackClick}
                    sx={{
                        mt: 0.5,
                        flexShrink: 0, // Prevent button from shrinking
                    }}
                    aria-label="Back to projects"
                >
                    <ChevronLeft />
                </IconButton>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, sm: 2 },
                            mb: 1,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 600,
                                // Responsive font size
                                fontSize: {
                                    xs: '1.5rem', // 24px on mobile
                                    sm: '2rem',   // 32px on tablet
                                    md: '2.125rem', // 34px on desktop
                                },
                                wordBreak: 'break-word',
                                minWidth: 0,
                            }}
                        >
                            {project.name}
                        </Typography>
                        <Chip
                            label={project.status}
                            color={getStatusColor(project.status)}
                            size="small"
                            sx={{
                                textTransform: 'capitalize',
                                flexShrink: 0,
                            }}
                        />
                    </Box>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            maxWidth: { xs: '100%', md: '800px' },
                            lineHeight: 1.6,
                            mb: { xs: 1, sm: 0 },
                            wordBreak: 'break-word',
                        }}
                    >
                        {project.description}
                    </Typography>

                    {project.owner && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                fontSize: {
                                    xs: '0.75rem',
                                    sm: '0.875rem',
                                },
                            }}
                        >
                            Owner: {project.owner}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Right section: Action buttons */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexShrink: 0,
                    // Responsive alignment
                    alignSelf: {
                        xs: 'flex-end',
                        sm: 'flex-start',
                    },
                    mt: {
                        xs: 2,
                        sm: 0,
                    },
                }}
            >
                <IconButton
                    onClick={onToggleSidebar}
                    aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    sx={{
                        backgroundColor: isSidebarCollapsed ? 'action.selected' : 'transparent',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        },
                        // Responsive size
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                    }}
                >
                    <Settings />
                </IconButton>
            </Box>
        </Box>
    );
};