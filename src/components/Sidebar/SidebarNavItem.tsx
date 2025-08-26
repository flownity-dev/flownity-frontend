import React from 'react';
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import type { SidebarNavItemProps } from '../../types/common.types';

/**
 * Individual navigation item component for the sidebar
 * Handles icon/label display, active state, hover effects, and tooltips
 */
const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
    item,
    isCollapsed,
    onClick,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    // Determine if this item is currently active based on the current route
    const isActive = location.pathname === item.path;

    const handleClick = () => {
        onClick(item.path);
        navigate(item.path);
    };

    const listItemContent = (
        <ListItem
            disablePadding
            sx={{
                display: 'block',
                mb: 0.5,
            }}
            role="listitem"
        >
            <ListItemButton
                onClick={handleClick}
                className={clsx({
                    'sidebar-nav-item': true,
                    'sidebar-nav-item--active': isActive,
                    'sidebar-nav-item--collapsed': isCollapsed,
                    'sidebar-nav-item--mobile': isMobile,
                })}
                sx={{
                    minHeight: isMobile ? 56 : 48, // Larger touch targets on mobile
                    px: 2.5,
                    py: isMobile ? 1.5 : 1, // More vertical padding on mobile
                    borderRadius: 1,
                    mx: 1,
                    transition: prefersReducedMotion ? 'none' : theme.transitions.create(
                        ['background-color', 'transform'],
                        {
                            duration: theme.transitions.duration.shorter,
                            easing: theme.transitions.easing.easeInOut,
                        }
                    ),
                    backgroundColor: isActive
                        ? theme.palette.primary.main
                        : 'transparent',
                    color: isActive
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,

                    // Enhanced touch interactions for mobile
                    ...(isMobile && {
                        '&:hover': {
                            backgroundColor: isActive
                                ? theme.palette.primary.dark
                                : theme.palette.action.hover,
                        },
                        '&:active': {
                            backgroundColor: isActive
                                ? theme.palette.primary.dark
                                : theme.palette.action.selected,
                            transform: prefersReducedMotion ? 'none' : 'scale(0.98)',
                        },
                        // Improve touch feedback
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                    }),
                    // Desktop hover effects
                    ...(!isMobile && {
                        '&:hover': {
                            backgroundColor: isActive
                                ? theme.palette.primary.dark
                                : theme.palette.action.hover,
                            transform: prefersReducedMotion ? 'none' : 'translateX(2px)',
                        },
                        '&:active': {
                            transform: prefersReducedMotion ? 'none' : 'translateX(1px)',
                        },
                    }),
                }}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
            >
                <ListItemIcon
                    sx={{
                        minWidth: isMobile ? 56 : 0, // Larger icon area on mobile
                        mr: isCollapsed ? 0 : 3,
                        justifyContent: 'center',
                        color: 'inherit',
                        transition: prefersReducedMotion ? 'none' : theme.transitions.create(['margin-right'], {
                            duration: theme.transitions.duration.shorter,
                            easing: theme.transitions.easing.easeInOut,
                        }),
                        // Larger icons on mobile for better touch targets
                        '& .MuiSvgIcon-root': {
                            fontSize: isMobile ? '1.5rem' : '1.25rem',
                        },
                    }}
                    aria-hidden="true"
                >
                    <item.icon />
                </ListItemIcon>

                {!isCollapsed && (
                    <ListItemText
                        primary={item.label}
                        sx={{
                            opacity: isCollapsed ? 0 : 1,
                            transition: prefersReducedMotion ? 'none' : theme.transitions.create(['opacity'], {
                                duration: theme.transitions.duration.shorter,
                                easing: theme.transitions.easing.easeInOut,
                            }),
                            '& .MuiListItemText-primary': {
                                fontSize: isMobile ? '1rem' : '0.875rem', // Larger text on mobile
                                fontWeight: isActive ? 600 : 400,
                                lineHeight: isMobile ? 1.5 : 1.4,
                            },
                        }}
                    />
                )}
                
                {/* Screen reader only text for collapsed state */}
                {isCollapsed && (
                    <Box
                        component="span"
                        sx={{
                            position: 'absolute',
                            width: 1,
                            height: 1,
                            padding: 0,
                            margin: -1,
                            overflow: 'hidden',
                            clip: 'rect(0, 0, 0, 0)',
                            whiteSpace: 'nowrap',
                            border: 0,
                        }}
                    >
                        {item.label}
                    </Box>
                )}
            </ListItemButton>
        </ListItem>
    );

    // Wrap with tooltip when collapsed to show the full label
    if (isCollapsed) {
        return (
            <Tooltip
                title={item.label}
                placement="right"
                arrow
                enterDelay={500}
                leaveDelay={200}
                slotProps={{
                    tooltip: {
                        sx: {
                            backgroundColor: theme.palette.grey[800],
                            color: theme.palette.common.white,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            '& .MuiTooltip-arrow': {
                                color: theme.palette.grey[800],
                            },
                        },
                    },
                }}
                // Accessibility for tooltips
                aria-describedby={`tooltip-${item.id}`}
                describeChild
            >
                {listItemContent}
            </Tooltip>
        );
    }

    return listItemContent;
};

export default SidebarNavItem;