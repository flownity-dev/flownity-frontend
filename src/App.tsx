import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import './App.css';
import { ThemeProvider } from './theme/ThemeProvider';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import { Sidebar } from './components/Sidebar';
import Diagram from './components/Diagram';
import Login from './components/Login';
import HomePage from './components/Homepage';
import { Projects } from './components/Projects';

// Main layout component that uses sidebar context - for authenticated routes only
function MainLayout() {
  const theme = useTheme();
  const { sidebarState } = useSidebar();
  const { isCollapsed, isMobile } = sidebarState;

  // Calculate main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (isMobile) {
      return 0; // No margin on mobile as sidebar overlays
    }
    return isCollapsed ? 5 : 5; // Collapsed or expanded width
  };

  // Calculate main content width for better responsive behavior
  const getMainContentWidth = () => {
    if (isMobile) {
      return '100vw'; // Full width on mobile
    }
    return `calc(100vw - ${getMainContentMargin()}px)`;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${getMainContentMargin()}px`,
          transition: theme.transitions.create(['margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          minHeight: '100vh',
          width: getMainContentWidth(),
          // Prevent content from being selectable when mobile sidebar is open
          ...(isMobile && !isCollapsed && {
            pointerEvents: 'none',
            userSelect: 'none',
          }),
          // Smooth transitions for responsive changes
          '@media (max-width: 768px)': {
            marginLeft: '0 !important',
            width: '100vw !important',
          },
        }}
      >
        <Routes>
          <Route path="/diagram" element={
            <div style={{
              width: '100%',
              height: '100vh',
              margin: 0,
              padding: 0,
              overflow: 'hidden'
            }}>
              <Diagram />
            </div>
          } />
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/task-groups" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <Router>
        <Routes>
          {/* Login route - completely separate from sidebar layout */}
          <Route path="/login" element={<Login />} />

          {/* All other routes use the main layout with sidebar */}
          <Route path="*" element={
            <SidebarProvider>
              <MainLayout />
            </SidebarProvider>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
