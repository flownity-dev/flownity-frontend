import React, { useState } from 'react';
import { 
  Button, 
  IconButton, 
  MenuItem, 
  CircularProgress, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface LogoutButtonProps {
  variant?: 'button' | 'icon' | 'menuItem';
  size?: 'small' | 'medium' | 'large';
  showConfirmDialog?: boolean;
  onLogoutComplete?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'button',
  size = 'medium',
  showConfirmDialog = false,
  onLogoutComplete
}) => {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = async () => {
    if (showConfirmDialog && !showDialog) {
      setShowDialog(true);
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      onLogoutComplete?.();
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we should clear local state
    } finally {
      setIsLoggingOut(false);
      setShowDialog(false);
    }
  };

  const handleConfirmLogout = () => {
    setShowDialog(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowDialog(false);
  };

  const buttonContent = isLoggingOut ? (
    <CircularProgress size={20} color="inherit" />
  ) : (
    <>
      <LogoutIcon sx={{ mr: variant === 'icon' ? 0 : 1 }} />
      {variant !== 'icon' && 'Logout'}
    </>
  );

  const commonProps = {
    onClick: handleLogout,
    disabled: isLoggingOut,
    size,
  };

  let buttonElement;

  switch (variant) {
    case 'icon':
      buttonElement = (
        <Tooltip title={`Logout ${user?.displayName || user?.username || ''}`}>
          <IconButton {...commonProps} color="inherit">
            {isLoggingOut ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
          </IconButton>
        </Tooltip>
      );
      break;

    case 'menuItem':
      buttonElement = (
        <MenuItem {...commonProps}>
          {buttonContent}
        </MenuItem>
      );
      break;

    default:
      buttonElement = (
        <Button
          {...commonProps}
          variant="outlined"
          color="inherit"
          startIcon={isLoggingOut ? <CircularProgress size={16} color="inherit" /> : <LogoutIcon />}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      );
  }

  return (
    <>
      {buttonElement}
      
      {/* Confirmation Dialog */}
      <Dialog
        open={showDialog}
        onClose={handleCancelLogout}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to logout? You will need to sign in again to access your account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmLogout} 
            color="primary" 
            variant="contained"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutButton;
