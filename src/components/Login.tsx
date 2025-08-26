import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { GitHub, Google } from '@mui/icons-material';

const Login: React.FC = () => {
  const theme = useMuiTheme();
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    console.log('GitHub login clicked');
    // For demo: navigate to diagram
    setTimeout(() => {
      navigate('/diagram');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // For demo: navigate to diagram
    setTimeout(() => {
      navigate('/diagram');
    }, 1000);

    // In a real app:
    // window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?...';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Flownity
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Project Visual Flow Diagram Platform
            </Typography>
          </Box>

          <Box mb={3}>
            <Typography
              variant="h5"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              Sign in to access your flow diagrams
            </Typography>
          </Box>

          <Stack spacing={3}>
            <Button
              variant="contained"
              size="large"
              startIcon={<GitHub />}
              onClick={handleGitHubLogin}
              sx={{
                py: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                backgroundColor: '#24292e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1a1e22',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(36, 41, 46, 0.3)'
                },
                transition: 'all 0.3s ease',
                textTransform: 'none'
              }}
              fullWidth
            >
              Continue with GitHub
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Button
              variant="contained"
              size="large"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              sx={{
                py: 1.5,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                backgroundColor: '#4285f4',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3367d6',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(66, 133, 244, 0.3)'
                },
                transition: 'all 0.3s ease',
                textTransform: 'none'
              }}
              fullWidth
            >
              Continue with Google
            </Button>
          </Stack>

          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              By signing in, you agree to our{' '}
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.dark' }
                }}
              >
                Terms of Service
              </Typography>{' '}
              and{' '}
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.dark' }
                }}
              >
                Privacy Policy
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
