import React, { useState, useCallback } from "react";
import { Container, Box, useTheme, useMediaQuery } from "@mui/material";
import ProjectsHeader from "./ProjectsHeader";
import ProjectsFilters from "./ProjectsFilters";
import ProjectsTable from "./ProjectsTable";
import ProjectsPagination from "./ProjectsPagination";
import CreateProjectModal from "./CreateProjectModal";
import { ErrorBoundary } from "../Common/ErrorBoundary";
import { useProjects } from "../../hooks/useProjects";

import type { CreateProjectFormData } from "../../types/common.types";

const Projects: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

	// State management for active filter and current page
	const [activeFilter, setActiveFilter] = useState<"all" | "archived">("all");
	const [currentPage, setCurrentPage] = useState<number>(1);

	// Modal state management
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

	// Items per page for pagination - responsive
	const itemsPerPage = isMobile ? 5 : 8;

	// Use custom hooks for data management
	const { projects, loading, error, totalPages, refetch } = useProjects({
		page: currentPage,
		limit: itemsPerPage,
		filter: activeFilter,
	});

	// Handler functions
	const handleFilterChange = (filter: "all" | "archived") => {
		setActiveFilter(filter);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	const handleNewProject = () => {
		setIsCreateModalOpen(true);
	};

	const handleCloseCreateModal = () => {
		setIsCreateModalOpen(false);
	};

	const handleCreateProject = useCallback(
		async (_projectData: CreateProjectFormData) => {
			try {
				// Refresh projects list after successful creation
				refetch();
				setIsCreateModalOpen(false);
			} catch (error) {
				console.error("Failed to refresh projects list:", error);
			}
		},
		[refetch]
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleRetry = useCallback(() => {
		refetch();
	}, [refetch]);

	return (
		<ErrorBoundary>
			<Container
				maxWidth="lg"
				sx={{
					mt: { xs: 2, sm: 3, md: 4 },
					px: { xs: 2, sm: 3 },
					pb: { xs: 2, sm: 3, md: 4 },
				}}
			>
				{/* Projects Header */}
				<Box mb={{ xs: 2, sm: 3 }}>
					<ProjectsHeader />
				</Box>

				{/* Projects Filters */}
				<Box mb={{ xs: 2, sm: 3 }}>
					<ProjectsFilters
						activeFilter={activeFilter}
						onFilterChange={handleFilterChange}
						onNewProject={handleNewProject}
						isMobile={isMobile}
					/>
				</Box>

				{/* Projects Table */}
				<Box mb={2}>
					<ProjectsTable
						projects={projects}
						loading={loading}
						error={error}
						onRetry={handleRetry}
						isMobile={isMobile}
						isTablet={isTablet}
					/>
				</Box>

				{/* Projects Pagination */}
				<Box>
					<ProjectsPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						isMobile={isMobile}
					/>
				</Box>

				{/* Create Project Modal */}
				<CreateProjectModal
					open={isCreateModalOpen}
					onClose={handleCloseCreateModal}
					onSubmit={handleCreateProject}
				/>
			</Container>
		</ErrorBoundary>
	);
};

export default Projects;
