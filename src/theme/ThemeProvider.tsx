import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme, highContrastLightTheme, highContrastDarkTheme } from './index';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    isHighContrast: boolean;
    toggleTheme: () => void;
    toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultMode = 'light'
}) => {
    const [mode, setMode] = useState<ThemeMode>(defaultMode);
    const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

    // Detect system preference for high contrast
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        setIsHighContrast(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsHighContrast(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const toggleHighContrast = () => {
        setIsHighContrast(prev => !prev);
    };

    // Select appropriate theme based on mode and high contrast preference
    const getTheme = () => {
        if (isHighContrast) {
            return mode === 'light' ? highContrastLightTheme : highContrastDarkTheme;
        }
        return mode === 'light' ? lightTheme : darkTheme;
    };

    const theme = getTheme();

    return (
        <ThemeContext.Provider value={{ mode, isHighContrast, toggleTheme, toggleHighContrast }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};