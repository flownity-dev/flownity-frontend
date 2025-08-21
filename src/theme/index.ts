import { createTheme } from '@mui/material/styles';

// Base theme configuration for common settings
const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14, // Standard font size
  },
  shape: {
    borderRadius: 8,
  },

};

// Light theme configuration
const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5', // Indigo
    },
    secondary: {
      main: '#6366F1',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
    success: {
      main: '#34D399',
    },
    warning: {
      main: '#FBBF24',
    },
    error: {
      main: '#F87171',
    },
    info: {
      main: '#60A5FA',
    },
  },
});

// Dark theme configuration
const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Indigo
    },
    secondary: {
      main: '#818CF8',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
    },
    divider: '#374151',
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#FACC15',
    },
    error: {
      main: '#F87171',
    },
    info: {
      main: '#3B82F6',
    },
  },
});

// High contrast light theme configuration
const highContrastLightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // Pure black for maximum contrast
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0000FF', // Pure blue
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // Pure white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000', // Pure black
      secondary: '#000000', // Pure black for secondary text too
    },
    divider: '#000000', // Black dividers
    success: {
      main: '#008000', // Pure green
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FF8C00', // Dark orange
      contrastText: '#000000',
    },
    error: {
      main: '#FF0000', // Pure red
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#0000FF', // Pure blue
      contrastText: '#FFFFFF',
    },
    action: {
      hover: '#F0F0F0', // Light gray for hover
      selected: '#E0E0E0', // Slightly darker gray for selected
    },
  },
});

// High contrast dark theme configuration
const highContrastDarkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF', // Pure white for maximum contrast
      contrastText: '#000000',
    },
    secondary: {
      main: '#00FFFF', // Cyan for visibility
      contrastText: '#000000',
    },
    background: {
      default: '#000000', // Pure black
      paper: '#000000',
    },
    text: {
      primary: '#FFFFFF', // Pure white
      secondary: '#FFFFFF', // Pure white for secondary text too
    },
    divider: '#FFFFFF', // White dividers
    success: {
      main: '#00FF00', // Pure green
      contrastText: '#000000',
    },
    warning: {
      main: '#FFFF00', // Pure yellow
      contrastText: '#000000',
    },
    error: {
      main: '#FF0000', // Pure red
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#00FFFF', // Cyan
      contrastText: '#000000',
    },
    action: {
      hover: '#333333', // Dark gray for hover
      selected: '#555555', // Lighter gray for selected
    },
  },
});

export { lightTheme, darkTheme, highContrastLightTheme, highContrastDarkTheme };

// Default export for light theme (backward compatibility)
export default lightTheme;