import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import type { SidebarState, SidebarContextType } from '../types/common.types';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
    children: ReactNode;
}

const SIDEBAR_STORAGE_KEY = 'flownity-sidebar-collapsed';

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    // Initialize sidebar state from localStorage or default based on screen size
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        // On mobile, always start collapsed
        if (isMobile) return true;

        // On desktop/tablet, use stored preference or default to expanded
        const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        return stored ? JSON.parse(stored) : false;
    });

    // Auto-collapse on mobile breakpoint changes
    useEffect(() => {
        if (isMobile && !isCollapsed) {
            setIsCollapsed(true);
        }
    }, [isMobile, isCollapsed]);

    // Handle responsive breakpoint changes and orientation changes
    useEffect(() => {
        const handleResize = () => {
            // Force collapse on mobile
            if (isMobile && !isCollapsed) {
                setIsCollapsed(true);
            }
            // On tablet/desktop, restore from localStorage if available
            else if (!isMobile) {
                const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
                if (stored) {
                    setIsCollapsed(JSON.parse(stored));
                }
            }
        };

        // Handle orientation changes on mobile devices
        const handleOrientationChange = () => {
            if (isMobile) {
                // Always collapse sidebar on orientation change for mobile
                setIsCollapsed(true);
            }
        };

        // Add event listeners for orientation change
        window.addEventListener('orientationchange', handleOrientationChange);

        // Add a small delay to prevent rapid state changes during resize
        const timeoutId = setTimeout(handleResize, 100);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [isMobile, isTablet, isCollapsed]);

    // Persist sidebar state to localStorage (only for non-mobile)
    useEffect(() => {
        // Don't persist mobile state as it should always start collapsed
        if (!isMobile) {
            localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isCollapsed));
        }
    }, [isCollapsed, isMobile]);

    const sidebarState: SidebarState = {
        isCollapsed,
        isMobile,
        prefersReducedMotion,
    };

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    const setSidebarCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
    };

    const contextValue: SidebarContextType = {
        sidebarState,
        toggleSidebar,
        setSidebarCollapsed,
    };

    return (
        <SidebarContext.Provider value={contextValue}>
            {children}
        </SidebarContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = (): SidebarContextType => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
