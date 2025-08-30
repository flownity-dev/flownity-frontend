import * as React from 'react';
import { Typography } from '@mui/material';

interface TaskGroupsHeaderProps {
  className?: string;
}

const TaskGroupsHeader: React.FC<TaskGroupsHeaderProps> = ({ className }) => {
  return (
    <Typography variant="h5" fontWeight={600} gutterBottom className={className}>
      Task Groups
    </Typography>
  );
};

export default TaskGroupsHeader;