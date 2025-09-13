import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import clsx from 'clsx';
import type { SidebarHeaderProps } from '../../types/common.types';

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <Box
      component="header"
      role="banner"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? theme.spacing(2.5, 2) : theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: isMobile ? 72 : 64, // Taller header on mobile
        transition: prefersReducedMotion ? 'none' : theme.transitions.create(['padding'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      {/* Logo and Brand Text */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {/* Logo/Icon placeholder - you can replace with actual logo */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: isCollapsed ? 0 : theme.spacing(1.5),
            transition: theme.transitions.create(['margin-right'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.contrastText,
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            F
          </Typography>
        </Box>

        {/* Brand Text */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            opacity: isCollapsed ? 0 : 1,
            transform: isCollapsed ? 'translateX(-10px)' : 'translateX(0)',
            transition: prefersReducedMotion ? 'none' : theme.transitions.create(['opacity', 'transform'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          className={clsx({
            'sidebar-brand-collapsed': isCollapsed,
            'sidebar-brand-expanded': !isCollapsed,
          })}
          aria-label="Flownity application logo"
        >
          FLOWNITY
        </Typography>
      </Box>

      {/* Collapse/Expand Toggle Button */}
      <Tooltip
        title={
          isMobile 
            ? (isCollapsed ? 'Open menu' : 'Close menu')
            : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar')
        }
        placement="right"
      >
        <IconButton
          onClick={onToggle}
          size={isMobile ? "medium" : "small"}
          sx={{
            padding: isMobile ? theme.spacing(1.5) : theme.spacing(0.5),
            marginLeft: isCollapsed ? 0 : theme.spacing(1),
            minWidth: isMobile ? 48 : 'auto',
            minHeight: isMobile ? 48 : 'auto',
            transition: prefersReducedMotion ? 'none' : theme.transitions.create(['margin-left'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            // Enhanced touch interactions for mobile
            ...(isMobile && {
              '&:active': {
                backgroundColor: theme.palette.action.selected,
                transform: prefersReducedMotion ? 'none' : 'scale(0.95)',
              },
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }),
          }}
          aria-label={
            isMobile 
              ? (isCollapsed ? 'Open navigation menu' : 'Close navigation menu')
              : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar')
          }
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-navigation"
        >
          {isMobile ? (
            <MenuIcon fontSize={isMobile ? "medium" : "small"} />
          ) : isCollapsed ? (
            <ChevronRightIcon fontSize="small" />
          ) : (
            <ChevronLeftIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SidebarHeader;
