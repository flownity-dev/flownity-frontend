import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if we have success/error parameters from backend redirect
      const params = new URLSearchParams(window.location.search);
      const success = params.get('success');
      const token = params.get('token');
      const error = params.get('error');
      const message = params.get('message');

        // Handle OAuth errors
        if (error || success === 'false') {
          const errorMessage = error === 'access_denied' 
            ? 'You denied access to the application' 
            : message || error || 'Authentication failed';
          setError(errorMessage);
          setIsProcessing(false);
          return;
        }

        // Handle successful authentication
        if (success === 'true' && token) {
          try {
            // Decode the token to get user info (for display purposes)
            // In a real app, you'd get user info from a separate API call
            const userData = {
              id: 'temp-id',
              providerId: 'temp-provider-id',
              provider: 'google' as const,
              username: 'user',
              displayName: 'User',
              createdAt: '',
              updatedAt: ''
            };

            // Store authentication data using context
            login(token, userData);

            // Navigate to dashboard
            navigate('/dashboard', { replace: true });
            return;
          } catch (tokenError) {
            console.error('Token processing error:', tokenError);
            setError('Failed to process authentication token');
            setIsProcessing(false);
            return;
          }
        }

        // If we don't have the expected parameters, this might be a direct callback
        // In this case, we should redirect to the login page
        setError('Invalid callback parameters');
        setIsProcessing(false);

      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate,login]);

  const handleRetry = () => {
    navigate('/login', { replace: true });
  };

  if (isProcessing) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Completing authentication...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we verify your credentials
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          px: 3,
        }}
      >
        <Alert 
          severity="error" 
          sx={{ maxWidth: 500, width: '100%' }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Try Again
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom>
            Authentication Failed
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return null;
};

export default OAuthCallback;
