import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

export interface ErrorStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  actionLabel = 'Try Again',
  onRetry,
  showRetry = true,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={6}
      gap={2}
      textAlign="center"
    >
      <ErrorIcon 
        sx={{ 
          fontSize: 64, 
          color: 'error.main',
          mb: 1 
        }} 
      />
      <Typography variant="h6" color="text.primary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {showRetry && onRetry && (
        <Button
          variant="outlined"
          color="error"
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
