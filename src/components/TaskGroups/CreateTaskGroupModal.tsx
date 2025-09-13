import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type {
  CreateTaskGroupModalProps,
  CreateTaskGroupFormData,
} from '../../types/common.types';

const CreateTaskGroupModal: React.FC<CreateTaskGroupModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const nameFieldRef = useRef<HTMLInputElement>(null);

  // Form state management
  const [formData, setFormData] = useState<CreateTaskGroupFormData>({
    task_group_title: '',
    description: '',
  });

  // Validation state management
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
  }>({});

  // Validation functions
  const validateField = (field: keyof CreateTaskGroupFormData, value: string): string | undefined => {
    switch (field) {
      case 'task_group_title':
        if (!value.trim()) {
          return 'Task Group name is required';
        }
        if (value.trim().length > 100) {
          return 'Task Group name must be 100 characters or less';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    // Validate name field
    const nameError = validateField('task_group_title', formData.task_group_title);
    if (nameError) {
      newErrors.name = nameError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes with real-time validation
  const handleInputChange = (field: keyof CreateTaskGroupFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Real-time validation for touched fields
    if (touched[field as keyof typeof touched]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  // Handle field blur to mark as touched and validate
  const handleFieldBlur = (field: keyof CreateTaskGroupFormData) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    // Validate field on blur
    const error = validateField(field, formData[field] as string);
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Mark all fields as touched for validation display
    setTouched({
      name: true,
    });

    // Validate entire form before submission
    if (validateForm()) {
      // Log form data to console as required
      console.log('Creating task group:', formData);
      onSubmit(formData);
      handleReset();
    }
  };

  // Handle modal close and form reset
  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Handle escape key press
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  // Reset form data and validation state
  const handleReset = () => {
    setFormData({
      task_group_title: '',
      description: '',
    });
    setErrors({});
    setTouched({});
  };

  // Focus management - focus first field when modal opens
  useEffect(() => {
    if (open && nameFieldRef.current) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        nameFieldRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      onKeyDown={handleKeyDown}
      aria-labelledby="create-task-group-dialog-title"
      aria-describedby="create-task-group-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          width: isMobile ? '100%' : '500px',
          maxWidth: isMobile ? '100%' : '500px',
          margin: isMobile ? 0 : theme.spacing(2),
          borderRadius: isMobile ? 0 : 2,
        },
        '& .MuiBackdrop-root': {
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(0, 0, 0, 0.8)' 
            : 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <DialogTitle
        id="create-task-group-dialog-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        Create Task Group
        <IconButton
          aria-label="close dialog"
          onClick={handleClose}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        id="create-task-group-dialog-description"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Box
          component="form"
          role="form"
          aria-label="Create task group form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
            pt: theme.spacing(1),
          }}
        >
          {/* Task Group Name Field */}
          <TextField
            inputRef={nameFieldRef}
            label="Task Group Name"
            placeholder="Task Group XYZ"
            value={formData.task_group_title}
            onChange={handleInputChange('task_group_title')}
            onBlur={handleFieldBlur('task_group_title')}
            required
            fullWidth
            variant="outlined"
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            aria-describedby={touched.name && errors.name ? 'name-error-text' : undefined}
            inputProps={{
              'aria-label': 'Task group name',
              maxLength: 100,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.secondary,
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          />

          {/* Description Field */}
          <TextField
            label="Description (Optional)"
            value={formData.description}
            onChange={handleInputChange('description')}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            inputProps={{
              'aria-label': 'Task group description (optional)',
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.secondary,
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: theme.spacing(3),
          pb: theme.spacing(2),
          gap: theme.spacing(1),
          flexDirection: isMobile ? 'column' : 'row',
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={handleClose}
          color="inherit"
          variant="outlined"
          fullWidth={isMobile}
          aria-label="Discard task group creation"
          sx={{
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.text.secondary,
            },
            '&:focus': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
          }}
        >
          Discard
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!formData.task_group_title.trim() || !!errors.name}
          fullWidth={isMobile}
          aria-label="Create new task group"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:focus': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          }}
        >
          Create Task Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskGroupModal;
