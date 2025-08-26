import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 56,
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium',
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={4}
      gap={2}
    >
      <CircularProgress size={sizeMap[size]} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};