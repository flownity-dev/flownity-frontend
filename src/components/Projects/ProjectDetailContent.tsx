import React from 'react';
import { Box, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import type { ProjectDetailContentProps } from '../../types/common.types';
import { ProjectTaskGroups } from './ProjectTaskGroups';
import { ProjectMembers } from './ProjectMembers';

/**
 * ProjectDetailContent component for project detail view
 * Renders content based on the active tab (Task Groups or Members)
 */
export const ProjectDetailContent: React.FC<ProjectDetailContentProps> = ({
    activeTab,
    project
}) => {


    /**
     * Main content switching logic based on active tab
     */
    const renderContent = () => {
        switch (activeTab) {
            case 'task-groups':
                return <ProjectTaskGroups project={project} />;
            case 'members':
                return <ProjectMembers project={project} />;
            default:
                return (
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            backgroundColor: 'background.default',
                            borderRadius: 2
                        }}
                    >
                        <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            Invalid Tab
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            The requested tab content is not available.
                        </Typography>
                    </Box>
                );
        }
    };

    return (
        <Box
            sx={{
                // Remove padding here as it's handled by parent container
                backgroundColor: 'background.default',
                minHeight: 'calc(100vh - 300px)', // Account for header and tabs
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            {renderContent()}
        </Box>
    );
};