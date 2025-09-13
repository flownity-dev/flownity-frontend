import React, { useState, useEffect } from 'react';
import { Container, Box, useTheme, useMediaQuery } from '@mui/material';
import TaskGroupsHeader from './TaskGroupsHeader';
import TaskGroupsFilters from './TaskGroupsFilters';
import TaskGroupsTable from './TaskGroupsTable';
import TaskGroupsPagination from './TaskGroupsPagination';
import CreateTaskGroupModal from './CreateTaskGroupModal';
import { getAllTaskGroups, createTaskGroup } from '../../services/taskGroupService';
import type { TaskGroup, CreateTaskGroupFormData } from '../../types/common.types';

const TaskGroups: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // State management for active filter, current page, and task groups data
  const [activeFilter, setActiveFilter] = useState<'all' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Items per page for pagination - responsive
  const itemsPerPage = isMobile ? 3 : 5;

  // Fetch task groups data when filter or page changes
  useEffect(() => {
    const fetchTaskGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllTaskGroups({
          page: currentPage,
          limit: itemsPerPage,
          filter: activeFilter
        });
        setTaskGroups(data);
      } catch (err) {
        console.error('Error fetching task groups:', err);
        setError(err instanceof Error ? err.message : 'Failed to load task groups');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskGroups();
  }, [activeFilter, currentPage, itemsPerPage]);

  // Server-side filtering and pagination - use task groups directly
  // TODO: Update to use paginated response from API when available
  const totalPages = Math.ceil(taskGroups.length / itemsPerPage);
  const paginatedTaskGroups = taskGroups;

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

  const handleCreateTaskGroup = async (taskGroupData: CreateTaskGroupFormData) => {
    try {
      console.log(taskGroupData);
      await createTaskGroup(taskGroupData);
      handleCloseCreateModal();
      // Refresh the task groups list with current filter
      const data = await getAllTaskGroups({
        page: currentPage,
        limit: itemsPerPage,
        filter: activeFilter
      });
      setTaskGroups(data);
    } catch (err) {
      console.error('Error creating task group:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task group');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTaskGroups({
        page: currentPage,
        limit: itemsPerPage,
        filter: activeFilter
      });
      setTaskGroups(data);
    } catch (err) {
      console.error('Error retrying task groups fetch:', err);
      setError(err instanceof Error ? err.message : 'Failed to load task groups');
    } finally {
      setLoading(false);
    }
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
