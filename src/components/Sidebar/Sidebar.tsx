import React from 'react';
import {
    Drawer,
    List,
    Box,
    useTheme,
    useMediaQuery,
    Backdrop,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Folder as FolderIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import clsx from 'clsx';
import { useSidebar } from '../../contexts/SidebarContext';
import SidebarHeader from './SidebarHeader';
import SidebarNavItem from './SidebarNavItem';
import SidebarFooter from './SidebarFooter';
import type { SidebarProps, NavigationItem } from '../../types/common.types';

// Default navigation items configuration
const defaultNavigationItems: NavigationItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: DashboardIcon,
        path: '/',
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: FolderIcon,
        path: '/projects',
    },
    {
        id: 'task-groups',
        label: 'Task Groups',
        icon: AssignmentIcon,
        path: '/task-groups',
    },
];

// Default user profile
const defaultUserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: undefined,
};

/**
 * Main Sidebar component using MUI Drawer with permanent variant
 * Implements Discord-style collapsible sidebar with smooth animations
 */
const Sidebar: React.FC<SidebarProps> = ({
    navigationItems = defaultNavigationItems,
    userProfile = defaultUserProfile,
}) => {
    const theme = useTheme();
    const { sidebarState, toggleSidebar } = useSidebar();
    const { isCollapsed, isMobile, prefersReducedMotion } = sidebarState;

    // Responsive breakpoints
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

    // Sidebar width configuration
    const collapsedWidth = 60;
    const expandedWidth = 240;
    const currentWidth = isCollapsed ? collapsedWidth : expandedWidth;

    // Handle navigation item clicks
    const handleNavItemClick = (path: string) => {
        // Log navigation for debugging (can be removed in production)
        console.log(`Navigating to: ${path}`);

        // On mobile, collapse sidebar after navigation
        if (isMobile && !isCollapsed) {
            toggleSidebar();
        }
    };

    // Handle backdrop click on mobile to close sidebar
    const handleBackdropClick = () => {
        if (isMobile && !isCollapsed) {
            toggleSidebar();
        }
    };

    // Mobile overlay backdrop
    const MobileBackdrop = () => {
        if (!isMobile || isCollapsed) return null;
        
        return (
            <Backdrop
                open={!isCollapsed}
                onClick={handleBackdropClick}
                sx={{
                    zIndex: theme.zIndex.drawer - 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    transition: theme.transitions.create(['opacity'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            />
        );
    };

    return (
        <>
            <MobileBackdrop />
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? !isCollapsed : true}
                onClose={isMobile ? handleBackdropClick : undefined}
                className={clsx('sidebar', {
                    'sidebar--collapsed': isCollapsed,
                    'sidebar--expanded': !isCollapsed,
                    'sidebar--mobile': isMobile,
                    'sidebar--tablet': isTablet,
                    'sidebar--desktop': isDesktop,
                })}
                // Accessibility attributes
                role="navigation"
                aria-label="Main navigation sidebar"
                aria-expanded={!isCollapsed}
                aria-hidden={isMobile && isCollapsed}
                id="sidebar-navigation"
                sx={{
                    width: isMobile ? expandedWidth : currentWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isMobile ? expandedWidth : currentWidth,
                        boxSizing: 'border-box',
                        backgroundColor: theme.palette.background.paper,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        transition: prefersReducedMotion ? 'none' : theme.transitions.create(['width', 'transform'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        overflowX: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: theme.zIndex.drawer,
                        // Mobile-specific styling
                        ...(isMobile && {
                            width: expandedWidth,
                            transform: 'translateX(0)',
                            boxShadow: theme.shadows[8],
                        }),
                        // Desktop/tablet responsive behavior
                        ...(!isMobile && {
                            width: currentWidth,
                            transform: 'translateX(0)',
                        }),
                        // Custom scrollbar styling
                        '&::-webkit-scrollbar': {
                            width: 6,
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.action.disabled,
                            borderRadius: 3,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                        },
                        // Touch-friendly interactions on mobile
                        ...(isMobile && {
                            '& .MuiListItem-root': {
                                minHeight: 48,
                                paddingTop: 12,
                                paddingBottom: 12,
                            },
                            '& .MuiListItemIcon-root': {
                                minWidth: 48,
                            },
                            '& .MuiIconButton-root': {
                                padding: 12,
                                minWidth: 48,
                                minHeight: 48,
                            },
                        }),
                    },
                }}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
            >
            {/* Sidebar Header */}
            <SidebarHeader
                isCollapsed={isCollapsed}
                onToggle={toggleSidebar}
            />

            {/* Navigation Items */}
            <Box
                component="nav"
                sx={{
                    flex: 1,
                    py: 1,
                    overflow: 'hidden auto',
                }}
                aria-label="Main navigation"
                role="navigation"
            >
                <List
                    sx={{
                        px: 0,
                        py: 0,
                    }}
                    role="list"
                    aria-label="Navigation menu items"
                >
                    {navigationItems.map((item) => (
                        <SidebarNavItem
                            key={item.id}
                            item={item}
                            isCollapsed={isCollapsed}
                            onClick={handleNavItemClick}
                        />
                    ))}
                </List>
            </Box>

            {/* Sidebar Footer */}
            <SidebarFooter
                userProfile={userProfile}
                isCollapsed={isCollapsed}
            />
        </Drawer>
        </>
    );
};

export default Sidebar;