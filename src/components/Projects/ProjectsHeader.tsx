import * as React from 'react';
import { Typography } from '@mui/material';
import type { ProjectsHeaderProps } from '../../types/common.types';

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ className }) => {
  return (
    <Typography variant="h5" fontWeight={600} gutterBottom className={className}>
      Projects
    </Typography>
  );
};

export default ProjectsHeader;