import React, { useState, useMemo } from 'react';
import { Container, Box, useTheme, useMediaQuery } from '@mui/material';
import ProjectsHeader from './ProjectsHeader';
import ProjectsFilters from './ProjectsFilters';
import ProjectsTable from './ProjectsTable';
import ProjectsPagination from './ProjectsPagination';
import CreateProjectModal from './CreateProjectModal';
import { sampleProjects } from './sampleData';
import type { Project, CreateProjectFormData } from '../../types/common.types';

const Projects: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // State management for active filter, current page, and projects data
  const [activeFilter, setActiveFilter] = useState<'all' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [projects] = useState<Project[]>(sampleProjects);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  // Modal state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Items per page for pagination - responsive
  const itemsPerPage = isMobile ? 5 : 10;

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'archived') {
      return projects.filter(project => project.status === 'archived');
    }
    return projects; // 'all' filter shows all projects
  }, [projects, activeFilter]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  // Handler functions
  const handleFilterChange = (filter: 'all' | 'archived') => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleNewProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateProject = (projectData: CreateProjectFormData) => {
    console.log('Creating project:', projectData);
    handleCloseCreateModal();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    // This will be implemented when API integration is added
    console.log('Retry functionality will be implemented with API integration');
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Projects Header */}
      <Box mb={{ xs: 2, sm: 3 }}>
        <ProjectsHeader />
      </Box>

      {/* Projects Filters */}
      <Box mb={{ xs: 2, sm: 3 }}>
        <ProjectsFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onNewProject={handleNewProject}
          isMobile={isMobile}
        />
      </Box>

      {/* Projects Table */}
      <Box mb={2}>
        <ProjectsTable
          projects={paginatedProjects}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      </Box>

      {/* Projects Pagination */}
      <Box>
        <ProjectsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isMobile={isMobile}
        />
      </Box>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateProject}
      />
    </Container>
  );
};

export default Projects;