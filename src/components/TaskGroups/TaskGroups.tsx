import React, { useState, useMemo } from 'react';
import { Container, Box, useTheme, useMediaQuery } from '@mui/material';
import TaskGroupsHeader from './TaskGroupsHeader';
import TaskGroupsFilters from './TaskGroupsFilters';
import TaskGroupsTable from './TaskGroupsTable';
import TaskGroupsPagination from './TaskGroupsPagination';
import CreateTaskGroupModal from './CreateTaskGroupModal';
import { sampleTaskGroups } from './sampleData';
import type { TaskGroup, CreateTaskGroupFormData } from '../../types/common.types';

const TaskGroups: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // State management for active filter, current page, and task groups data
  const [activeFilter, setActiveFilter] = useState<'all' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [taskGroups] = useState<TaskGroup[]>(sampleTaskGroups);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  // Modal state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Items per page for pagination - responsive
  const itemsPerPage = isMobile ? 3 : 5;

  // Filter task groups based on active filter
  const filteredTaskGroups = useMemo(() => {
    if (activeFilter === 'archived') {
      return taskGroups.filter(taskGroup => taskGroup.status === 'archived');
    }
    return taskGroups.filter(taskGroup => taskGroup.status === 'active'); // 'all' filter shows active task groups
  }, [taskGroups, activeFilter]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredTaskGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTaskGroups = filteredTaskGroups.slice(startIndex, startIndex + itemsPerPage);

  // Handler functions
  const handleFilterChange = (filter: 'all' | 'archived') => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleNewTaskGroup = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateTaskGroup = (taskGroupData: CreateTaskGroupFormData) => {
    console.log('Creating task group:', taskGroupData);
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
      {/* Task Groups Header */}
      <Box mb={{ xs: 2, sm: 3 }}>
        <TaskGroupsHeader />
      </Box>

      {/* Task Groups Filters */}
      <Box mb={{ xs: 2, sm: 3 }}>
        <TaskGroupsFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onNewTaskGroup={handleNewTaskGroup}
          isMobile={isMobile}
        />
      </Box>

      {/* Task Groups Table */}
      <Box mb={2}>
        <TaskGroupsTable
          taskGroups={paginatedTaskGroups}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      </Box>

      {/* Task Groups Pagination */}
      <Box>
        <TaskGroupsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isMobile={isMobile}
        />
      </Box>

      {/* Create Task Group Modal */}
      <CreateTaskGroupModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateTaskGroup}
      />
    </Container>
  );
};

export default TaskGroups;
