import React from 'react';
import { Box, Button, ButtonGroup, Stack } from '@mui/material';
import type { ProjectsFiltersProps } from '../../types/common.types';

const ProjectsFilters: React.FC<ProjectsFiltersProps> = ({
  activeFilter,
  onFilterChange,
  onNewProject,
  isMobile = false,
}) => {
  const handleFilterChange = (filter: 'all' | 'archived') => {
    console.log('Filter changed to:', filter);
    onFilterChange(filter);
  };

  const handleNewProject = () => {
    console.log('New project button clicked');
    onNewProject();
  };

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {/* Filter buttons stacked on mobile */}
        <ButtonGroup 
          variant="outlined" 
          size="medium" 
          fullWidth
          sx={{
            '& .MuiButton-root': {
              flex: 1,
            },
          }}
        >
          <Button
            variant={activeFilter === 'all' ? 'contained' : 'outlined'}
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button
            variant={activeFilter === 'archived' ? 'contained' : 'outlined'}
            onClick={() => handleFilterChange('archived')}
          >
            Archived
          </Button>
        </ButtonGroup>

        {/* New button full width on mobile */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewProject}
          fullWidth
          size="large"
          sx={{
            fontWeight: 600,
            py: 1.5,
          }}
        >
          New Project
        </Button>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {/* Filter buttons on the left */}
      <ButtonGroup variant="outlined" size="medium">
        <Button
          variant={activeFilter === 'all' ? 'contained' : 'outlined'}
          onClick={() => handleFilterChange('all')}
          sx={{
            minWidth: { xs: 70, sm: 80 },
          }}
        >
          All
        </Button>
        <Button
          variant={activeFilter === 'archived' ? 'contained' : 'outlined'}
          onClick={() => handleFilterChange('archived')}
          sx={{
            minWidth: { xs: 70, sm: 80 },
          }}
        >
          Archived
        </Button>
      </ButtonGroup>

      {/* New button on the right */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleNewProject}
        sx={{
          minWidth: { xs: 90, sm: 100 },
          fontWeight: 600,
        }}
      >
        New
      </Button>
    </Box>
  );
};

export default ProjectsFilters;
