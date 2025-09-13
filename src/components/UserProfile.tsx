import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Stack,
  Paper,
  Divider,

} from '@mui/material';
import { GitHub, Google, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  variant?: 'full' | 'compact' | 'minimal';
  showProvider?: boolean;
  showLogoutButton?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  variant = 'full',
  showProvider = true,
  showLogoutButton = false // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github':
        return <GitHub fontSize="small" />;
      case 'google':
        return <Google fontSize="small" />;
      default:
        return <Person fontSize="small" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'github':
        return '#24292e';
      case 'google':
        return '#4285f4';
      default:
        return 'default';
    }
  };

  if (variant === 'minimal') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          src={user.profilePictureUrl}
          alt={user.displayName}
          sx={{ width: 32, height: 32 }}
        >
          {user.displayName?.charAt(0) || user.username?.charAt(0)}
        </Avatar>
        <Typography variant="body2" noWrap>
          {user.displayName || user.username}
        </Typography>
      </Box>
    );
  }

  if (variant === 'compact') {
    return (
      <Paper sx={{ p: 2, maxWidth: 300 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user.profilePictureUrl}
            alt={user.displayName}
            sx={{ width: 48, height: 48 }}
          >
            {user.displayName?.charAt(0) || user.username?.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {user.displayName || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email || `@${user.username}`}
            </Typography>
            {showProvider && (
              <Chip
                icon={getProviderIcon(user.provider)}
                label={user.provider}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: getProviderColor(user.provider),
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            )}
          </Box>
        </Stack>
      </Paper>
    );
  }

  // Full variant
  return (
    <Paper sx={{ p: 3, maxWidth: 400 }}>
      <Stack spacing={2}>
        {/* Header with avatar and basic info */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user.profilePictureUrl}
            alt={user.displayName}
            sx={{ width: 64, height: 64 }}
          >
            {user.displayName?.charAt(0) || user.username?.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" noWrap>
              {user.displayName || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              @{user.username}
            </Typography>
            {user.email && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider />

        {/* Additional user details */}
        <Stack spacing={1}>
          {user.fullName && user.fullName !== user.displayName && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body2">{user.fullName}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary">
              User ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {user.id}
            </Typography>
          </Box>

          {showProvider && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Authentication Provider
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  icon={getProviderIcon(user.provider)}
                  label={`${user.provider} (${user.providerId})`}
                  size="small"
                  sx={{
                    backgroundColor: getProviderColor(user.provider),
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="body2">
              {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          {user.updatedAt !== user.createdAt && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body2">
                {new Date(user.updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserProfile;
