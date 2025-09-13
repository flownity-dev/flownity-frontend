import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { Groups, Assignment } from '@mui/icons-material';
import type { ProjectDetailTabsProps, ProjectDetailTab } from '../../types/common.types';

/**
 * Tab configuration for project detail navigation
 */
const TAB_CONFIG = [
    {
        value: 'task-groups' as ProjectDetailTab,
        label: 'Task Groups',
        icon: Assignment
    },
    {
        value: 'members' as ProjectDetailTab,
        label: 'Members',
        icon: Groups
    }
] as const;

/**
 * ProjectDetailTabs component for project detail view navigation
 * Provides tab navigation between Task Groups and Members sections
 */
export const ProjectDetailTabs: React.FC<ProjectDetailTabsProps> = ({
    activeTab,
    onTabChange
}) => {
    const handleTabChange = (_event: React.SyntheticEvent, newValue: ProjectDetailTab) => {
        onTabChange(newValue);
    };

    return (
        <Box
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                // Responsive padding
                px: {
                    xs: 2, // 16px on mobile
                    sm: 3, // 24px on tablet
                    md: 4, // 32px on desktop
                },
                // Ensure proper overflow handling
                overflow: 'auto',
            }}
        >
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Project detail navigation tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0'
                    },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                        // Responsive font size
                        fontSize: {
                            xs: '0.875rem', // 14px on mobile
                            sm: '0.95rem',  // 15.2px on tablet+
                        },
                        // Responsive height
                        minHeight: {
                            xs: 44, // Smaller on mobile
                            sm: 48, // Standard on tablet+
                        },
                        // Responsive padding
                        px: {
                            xs: 1.5, // 12px on mobile
                            sm: 2,   // 16px on tablet+
                        },
                        minWidth: {
                            xs: 'auto', // Allow smaller tabs on mobile
                            sm: 120,    // Minimum width on tablet+
                        },
                        '&:hover': {
                            backgroundColor: 'action.hover',
                            opacity: 1
                        },
                        '&.Mui-selected': {
                            fontWeight: 600,
                            color: 'primary.main'
                        }
                    },
                    // Responsive scroll buttons
                    '& .MuiTabs-scrollButtons': {
                        '&.Mui-disabled': {
                            opacity: 0.3,
                        },
                    },
                }}
            >
                {TAB_CONFIG.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            label={tab.label}
                            icon={<IconComponent sx={{ 
                                fontSize: { xs: 18, sm: 20 } 
                            }} />}
                            iconPosition="start"
                            sx={{
                                '& .MuiTab-iconWrapper': {
                                    mr: { xs: 0.5, sm: 1 },
                                    mb: 0
                                },
                                // Hide labels on very small screens if needed
                                '& .MuiTab-labelContainer': {
                                    display: {
                                        xs: 'block', // Keep labels on mobile for now
                                        sm: 'block',
                                    },
                                },
                            }}
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
};
