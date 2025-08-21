import React from 'react';

/**
 * Navigation item interface for sidebar navigation
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path: string;
  isActive?: boolean;
}

/**
 * Sidebar state interface for managing collapse/expand state
 */
export interface SidebarState {
  isCollapsed: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Context type for sidebar state management
 */
export interface SidebarContextType {
  sidebarState: SidebarState;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

/**
 * User profile interface for sidebar footer
 */
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Theme-related interfaces for sidebar styling
 */
export interface SidebarTheme {
  collapsed: {
    width: number;
  };
  expanded: {
    width: number;
  };
  transition: {
    duration: number;
    easing: string;
  };
}

/**
 * Navigation configuration type for defining sidebar navigation structure
 */
export interface NavigationConfig {
  items: NavigationItem[];
  userProfile: UserProfile;
  theme: SidebarTheme;
}

/**
 * Sidebar component props interface
 */
export interface SidebarProps {
  navigationItems?: NavigationItem[];
  userProfile?: UserProfile;
}

/**
 * Individual sidebar navigation item props
 */
export interface SidebarNavItemProps {
  item: NavigationItem;
  isCollapsed: boolean;
  onClick: (path: string) => void;
}

/**
 * Sidebar header component props
 */
export interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Sidebar footer component props
 */
export interface SidebarFooterProps {
  userProfile: UserProfile;
  isCollapsed: boolean;
}