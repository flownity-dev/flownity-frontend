import React from 'react';
import { Box, Pagination } from '@mui/material';
import type { ProjectsPaginationProps } from '../../types/common.types';

const ProjectsPagination: React.FC<ProjectsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isMobile = false,
}) => {
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    console.log('Pagination changed to page:', page);
    onPageChange(page);
  };

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-end',
        alignItems: 'center',
        mt: 2,
        mb: 2,
        px: isMobile ? 1 : 0,
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
        showFirstButton={!isMobile}
        showLastButton={!isMobile}
        size={isMobile ? "small" : "medium"}
        siblingCount={isMobile ? 0 : 1}
        boundaryCount={isMobile ? 1 : 1}
        sx={{
          '& .MuiPaginationItem-root': {
            ...(isMobile && {
              minWidth: 32,
              height: 32,
              fontSize: '0.875rem',
            }),
          },
        }}
      />
    </Box>
  );
};

export default ProjectsPagination;
