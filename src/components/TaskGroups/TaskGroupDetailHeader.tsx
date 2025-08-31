import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { TaskGroupDetailHeaderProps } from '../../types/common.types';

/**
 * Header component for task group detail view
 * Displays task group name, description, and back button
 */
const TaskGroupDetailHeader: React.FC<TaskGroupDetailHeaderProps> = ({
  taskGroup,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/task-groups');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        // Responsive padding
        p: {
          xs: 2, // 16px on mobile
          sm: 3, // 24px on tablet
          md: 4, // 32px on desktop
        },
        // Responsive gap
        gap: { xs: 1, sm: 2 },
        backgroundColor: 'background.paper',
      }}
    >
      <IconButton
        onClick={handleBackClick}
        sx={{
          mt: 0.5,
          flexShrink: 0, // Prevent button from shrinking
        }}
        aria-label="Back to task groups"
      >
        <ChevronLeft />
      </IconButton>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            // Responsive font size
            fontSize: {
              xs: '1.5rem', // 24px on mobile
              sm: '2rem',   // 32px on tablet
              md: '2.125rem', // 34px on desktop
            },
            wordBreak: 'break-word',
            minWidth: 0,
            mb: 1,
          }}
        >
          {taskGroup.name}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: { xs: '100%', md: '800px' },
            lineHeight: 1.6,
            mb: { xs: 1, sm: 0 },
            wordBreak: 'break-word',
          }}
        >
          {taskGroup.description}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
            },
          }}
        >
          Project: {taskGroup.projectName} • {taskGroup.taskCount} tasks
        </Typography>
      </Box>
    </Box>
  );
};

export default TaskGroupDetailHeader;