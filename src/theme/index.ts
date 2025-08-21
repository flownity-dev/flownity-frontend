import { createTheme } from '@mui/material/styles';

// Light theme configuration
const lightTheme = createTheme({
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
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14, // Standard font size
  },
  shape: {
    borderRadius: 8,
  },
});

// Dark theme configuration
const darkTheme = createTheme({
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
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14, // Standard font size
  },
  shape: {
    borderRadius: 8,
  },
});

export { lightTheme, darkTheme };

// Default export for light theme (backward compatibility)
export default lightTheme;