import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type {
  CreateProjectModalProps,
  CreateProjectFormData,
  ProjectPriority
} from '../../types/common.types';
import { PRIORITY_OPTIONS } from '../../types/common.types';

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const nameFieldRef = useRef<HTMLInputElement>(null);

  // Form state management
  const [formData, setFormData] = useState<CreateProjectFormData>({
    name: '',
    description: '',
    priority: 'medium',
  });

  // Validation state management
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
  }>({});

  // Validation functions
  const validateField = (field: keyof CreateProjectFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'Project name is required';
        }
        if (value.trim().length > 100) {
          return 'Project name must be 100 characters or less';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    // Validate name field
    const nameError = validateField('name', formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes with real-time validation
  const handleInputChange = (field: keyof CreateProjectFormData) => (
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
  const handleFieldBlur = (field: keyof CreateProjectFormData) => () => {
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

  const handlePriorityChange = (event: SelectChangeEvent<ProjectPriority>) => {
    setFormData(prev => ({
      ...prev,
      priority: event.target.value as ProjectPriority,
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
      console.log('Creating project:', formData);
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
      name: '',
      description: '',
      priority: 'medium',
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
      aria-labelledby="create-project-dialog-title"
      aria-describedby="create-project-dialog-description"
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
        id="create-project-dialog-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        Create a Project
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
        id="create-project-dialog-description"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Box
          component="form"
          role="form"
          aria-label="Create project form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
            pt: theme.spacing(1),
          }}
        >
          {/* Project Name Field */}
          <TextField
            inputRef={nameFieldRef}
            label="Project Name"
            placeholder="Project XYZ"
            value={formData.name}
            onChange={handleInputChange('name')}
            onBlur={handleFieldBlur('name')}
            required
            fullWidth
            variant="outlined"
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            aria-describedby={touched.name && errors.name ? 'name-error-text' : undefined}
            inputProps={{
              'aria-label': 'Project name',
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
              'aria-label': 'Project description (optional)',
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

          {/* Priority Field */}
          <FormControl 
            fullWidth 
            variant="outlined"
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
          >
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              value={formData.priority}
              onChange={handlePriorityChange}
              label="Priority"
              aria-label="Project priority"
              inputProps={{
                'aria-describedby': 'priority-helper-text',
              }}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  sx={{
                    color: theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected,
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                      },
                    },
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          aria-label="Discard project creation"
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
          disabled={!formData.name.trim() || !!errors.name}
          fullWidth={isMobile}
          aria-label="Create new project"
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
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;