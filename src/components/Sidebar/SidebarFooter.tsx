import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Tooltip,
    Avatar,
    Menu,
    MenuItem,
    Typography,
    Divider,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme as useMuiTheme,
} from '@mui/material';
import {
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeProvider';
import type { SidebarFooterProps } from '../../types/common.types';

const userMenuItems = [
    { id: 'profile', label: 'Profile', icon: PersonIcon },
    { id: 'account', label: 'Account', icon: SettingsIcon },
    { id: 'logout', label: 'Logout', icon: LogoutIcon },
];

const SidebarFooter: React.FC<SidebarFooterProps> = ({ userProfile, isCollapsed }) => {
    const { mode, toggleTheme } = useTheme();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuItemClick = (itemId: string) => {
        handleCloseUserMenu();
        // Handle menu item actions here
        console.log(`Menu item clicked: ${itemId}`);

        if (itemId === 'logout') {
            // Remove authToken from localStorage
            localStorage.removeItem('authToken');

            // Optionally, redirect to login page
            window.location.href = '/login';

            console.log('Logging out...');
        }


    };

    return (
        <Box
            component="footer"
            role="contentinfo"
            sx={{
                p: isMobile ? 1.5 : 1,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? 1.5 : 1,
            }}
            aria-label="Sidebar footer with theme toggle and user profile"
        >
            {/* Theme Toggle */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    alignItems: 'center',
                    px: isCollapsed ? 0 : 1,
                }}
            >
                <Tooltip
                    title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
                    placement={isCollapsed ? 'right' : 'top'}
                >
                    <IconButton
                        onClick={toggleTheme}
                        size={isMobile ? "medium" : "small"}
                        sx={{
                            color: 'text.secondary',
                            padding: isMobile ? 1.5 : 1,
                            minWidth: isMobile ? 48 : 'auto',
                            minHeight: isMobile ? 48 : 'auto',
                            '&:hover': {
                                color: 'primary.main',
                                backgroundColor: 'action.hover',
                            },
                            // Enhanced touch interactions for mobile
                            ...(isMobile && {
                                '&:active': {
                                    backgroundColor: 'action.selected',
                                    transform: prefersReducedMotion ? 'none' : 'scale(0.95)',
                                },
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation',
                            }),
                            transition: prefersReducedMotion ? 'none' : 'all 0.2s ease-in-out',
                        }}
                        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
                        role="switch"
                        aria-checked={mode === 'dark'}
                    >
                        {mode === 'light' ?
                            <DarkModeIcon fontSize={isMobile ? "medium" : "small"} /> :
                            <LightModeIcon fontSize={isMobile ? "medium" : "small"} />
                        }
                    </IconButton>
                </Tooltip>

                {!isCollapsed && (
                    <Box sx={{ ml: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                                opacity: isCollapsed ? 0 : 1,
                                transition: prefersReducedMotion ? 'none' : 'opacity 0.2s ease-in-out',
                            }}
                        >
                            {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* User Profile */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: isCollapsed ? 0 : 1,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                }}
            >
                <Tooltip
                    title="User menu"
                    placement={isCollapsed ? 'right' : 'top'}
                >
                    <IconButton
                        onClick={handleOpenUserMenu}
                        size={isMobile ? "medium" : "small"}
                        sx={{
                            p: isMobile ? 1 : 0.5,
                            minWidth: isMobile ? 48 : 'auto',
                            minHeight: isMobile ? 48 : 'auto',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                            // Enhanced touch interactions for mobile
                            ...(isMobile && {
                                '&:active': {
                                    backgroundColor: 'action.selected',
                                    transform: prefersReducedMotion ? 'none' : 'scale(0.95)',
                                },
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation',
                            }),
                            transition: prefersReducedMotion ? 'none' : 'all 0.2s ease-in-out',
                        }}
                        aria-label={`User menu for ${userProfile.name}`}
                        aria-haspopup="menu"
                        aria-expanded={Boolean(anchorElUser)}
                        aria-controls={anchorElUser ? 'user-menu' : undefined}
                    >
                        <Avatar
                            alt={userProfile.name}
                            src={userProfile.avatar}
                            sx={{
                                width: isMobile ? 40 : (isCollapsed ? 32 : 36),
                                height: isMobile ? 40 : (isCollapsed ? 32 : 36),
                                fontSize: isMobile ? '1.1rem' : (isCollapsed ? '0.875rem' : '1rem'),
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            {userProfile.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                </Tooltip>

                {!isCollapsed && (
                    <Box
                        sx={{
                            ml: 1,
                            minWidth: 0,
                            opacity: isCollapsed ? 0 : 1,
                            transition: 'opacity 0.2s ease-in-out',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.primary',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {userProfile.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                lineHeight: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                            }}
                        >
                            {userProfile.email}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* User Menu */}
            <Menu
                sx={{ mt: '-45px' }}
                id="user-menu"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: isCollapsed ? 'right' : 'center',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: isCollapsed ? 'left' : 'center',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                role="menu"
                aria-labelledby="user-menu-button"
                MenuListProps={{
                    'aria-labelledby': 'user-menu-button',
                    role: 'menu',
                }}
                PaperProps={{
                    sx: {
                        minWidth: isMobile ? 240 : 200,
                        boxShadow: 3,
                        // Enhanced touch targets on mobile
                        ...(isMobile && {
                            '& .MuiMenuItem-root': {
                                minHeight: 48,
                                paddingY: 1.5,
                            },
                        }),
                    },
                }}
            >
                {/* User info header in menu */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {userProfile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {userProfile.email}
                    </Typography>
                </Box>

                {userMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isLastItem = index === userMenuItems.length - 1;

                    return (
                        <React.Fragment key={item.id}>
                            {isLastItem && <Divider />}
                            <MenuItem
                                onClick={() => handleMenuItemClick(item.id)}
                                sx={{
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                                role="menuitem"
                                aria-label={item.label}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <IconComponent fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        fontWeight: isLastItem ? 500 : 400,
                                        color: isLastItem ? 'error.main' : 'text.primary',
                                    }}
                                />
                            </MenuItem>
                        </React.Fragment>
                    );
                })}
            </Menu>
        </Box>
    );
};

export default SidebarFooter;
