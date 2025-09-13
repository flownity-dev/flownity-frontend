import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { LoadingState, ErrorState, ErrorBoundary } from '../Common';
import { ProjectDetailHeader } from './ProjectDetailHeader';
import { ProjectDetailTabs } from './ProjectDetailTabs';
import { ProjectDetailContent } from './ProjectDetailContent';
import ProjectDetailSidebar from './ProjectDetailSidebar';
import { getProjectById } from '../../services/projectService';

import type { 
  ProjectDetailViewProps, 
  ProjectDetailData, 
  ProjectDetailTab 
} from '../../types/common.types';

/**
 * ProjectDetailView - Main container component for project detail view
 * 
 * This component orchestrates all sub-components and manages the overall state
 * for the project detail view including:
 * - Project ID parameter extraction from React Router
 * - Active tab state management (Task Groups/Members)
 * - Right sidebar collapse state management
 * - Project data lookup from sample data
 * - Error handling for invalid project IDs
 */
export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ className }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<ProjectDetailTab>('task-groups');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile);

  /**
   * Effect to load project data based on ID parameter
   */
  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        // Validate project ID parameter
        if (!id || id.trim() === '') {
          setNotFound(true);
          return;
        }

        // Call the real API to get project by ID
        const foundProject = await getProjectById(id);
        setProject(foundProject);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
        
        // Check if it's a "not found" error
        if (errorMessage.includes('not found') || errorMessage.includes('404')) {
          setNotFound(true);
        } else {
          setError(errorMessage);
        }
        
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  /**
   * Effect to handle responsive sidebar behavior
   */
  useEffect(() => {
    // Collapse sidebar on mobile by default
    if (isMobile && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile, isSidebarCollapsed]);

  /**
   * Handle tab change events
   */
  const handleTabChange = (tab: ProjectDetailTab) => {
    setActiveTab(tab);
  };

  /**
   * Handle sidebar toggle events
   */
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  /**
   * Handle retry action for error states
   */
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    
    // Re-run the load project logic
    const loadProject = async () => {
      try {
        if (!id || id.trim() === '') {
          setNotFound(true);
          return;
        }

        // Call the real API to get project by ID
        const foundProject = await getProjectById(id);
        setProject(foundProject);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
        
        // Check if it's a "not found" error
        if (errorMessage.includes('not found') || errorMessage.includes('404')) {
          setNotFound(true);
        } else {
          setError(errorMessage);
        }
        
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  };

  /**
   * Handle navigation back to projects list
   */
  const handleBackToProjects = () => {
    navigate('/project');
  };



  // Loading state
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingState message="Loading project details..." />
      </Container>
    );
  }

  // Project not found state
  if (notFound) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorState
          title="Project Not Found"
          description={`Project with ID "${id}" could not be found. It may have been deleted or you may not have access to it.`}
          onRetry={handleBackToProjects}
          actionLabel="Back to Projects"
          showRetry={true}
        />
      </Container>
    );
  }

  // General error state
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorState
          title="Failed to Load Project"
          description={error}
          onRetry={handleRetry}
          actionLabel="Try Again"
          showRetry={true}
        />
      </Container>
    );
  }

  // Project is null but no error - should not happen, but handle gracefully
  if (!project) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorState
          title="Project Data Missing"
          description="Project data could not be loaded. Please try again."
          onRetry={handleRetry}
          actionLabel="Try Again"
          showRetry={true}
        />
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      {/* Project Header - Fixed at top */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.appBar - 1,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <ErrorBoundary
          fallback={
            <Box sx={{ p: 2 }}>
              <ErrorState
                title="Header Error"
                description="Failed to load project header"
                showRetry={false}
              />
            </Box>
          }
        >
          <ProjectDetailHeader
            project={project}
            onToggleSidebar={handleToggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </ErrorBoundary>
      </Box>

      {/* Tab Navigation - Fixed below header */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 'auto',
          zIndex: theme.zIndex.appBar - 2,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <ErrorBoundary
          fallback={
            <Box sx={{ p: 2 }}>
              <ErrorState
                title="Navigation Error"
                description="Failed to load navigation tabs"
                showRetry={false}
              />
            </Box>
          }
        >
          <ProjectDetailTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </ErrorBoundary>
      </Box>

      {/* Three-Panel Layout Container */}
      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0, // Allow flex children to shrink
        }}
      >
        {/* Main Content Panel */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            minWidth: 0, // Prevent flex item from overflowing
            transition: theme.transitions.create(['margin-right'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            // Responsive margin for sidebar
            marginRight: {
              xs: 0, // No margin on mobile
              md: isSidebarCollapsed ? 0 : '320px', // Sidebar width on desktop
            },
            // Responsive padding
            p: {
              xs: 2, // 16px on mobile
              sm: 3, // 24px on tablet
              md: 4, // 32px on desktop
            },
            backgroundColor: 'background.default',
          }}
        >
          <ErrorBoundary
            fallback={
              <ErrorState
                title="Content Error"
                description="Failed to load project content"
                onRetry={handleRetry}
                actionLabel="Reload Content"
              />
            }
          >
            <ProjectDetailContent
              activeTab={activeTab}
              project={project}
            />
          </ErrorBoundary>
        </Box>

        {/* Right Sidebar Panel */}
        <ErrorBoundary
          fallback={
            <Box sx={{ width: isSidebarCollapsed ? 0 : 320, p: 2 }}>
              <ErrorState
                title="Sidebar Error"
                description="Failed to load sidebar"
                showRetry={false}
              />
            </Box>
          }
        >
          <ProjectDetailSidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={handleToggleSidebar}
            project={project}
          />
        </ErrorBoundary>
      </Box>
    </Container>
  );
};

export default ProjectDetailView;
