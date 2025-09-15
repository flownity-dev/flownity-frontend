import React from "react";
import { useNavigate } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Typography,
	Card,
	CardContent,
	Stack,
	Box,
	useTheme,
	ListItemIcon,
	useMediaQuery,
} from "@mui/material";
import { FolderOpen as FolderOpenIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import type {
	ProjectsTableProps,
	ProjectStatus,
	Project,
} from "../../types/common.types";
import { LoadingState, EmptyState, ErrorState } from "../Common";
import DialogComponent from "../Common/DialogComponent";
import { deleteProject } from "../../services/projectService";

const ProjectsTable: React.FC<ProjectsTableProps> = ({
	projects = [],
	loading = false,
	error = null,
	onRetry,
	isMobile = false,
	isTablet = false,
}) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const prefersReducedMotion = useMediaQuery(
		"(prefers-reduced-motion: reduce)"
	);

	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [selectedProject, setSelectedProject] = React.useState<Project | null>(
		null
	);
	const [deleting, setDeleting] = React.useState(false);

	/**
	 * Handle project click to navigate to detail view
	 */
	const handleProjectClick = (projectId: string) => {
		navigate(`/project/${projectId}`);
	};
	/**
	 * Get appropriate color for project status chip
	 */
	const getStatusColor = (
		status: ProjectStatus
	): "success" | "info" | "warning" | "default" => {
		switch (status) {
			case "done":
				return "success";
			case "in-progress":
			case "in-review":
				return "info";
			case "on-hold":
			case "blocked":
				return "warning";
			default:
				return "default";
		}
	};

	/**
	 * Format status text for display
	 */
	const getStatusLabel = (status: ProjectStatus): string => {
		switch (status) {
			case "on-hold":
				return "On Hold";
			default:
				return status.charAt(0).toUpperCase() + status.slice(1);
		}
	};

	/**
	 * Format date for display - responsive format
	 */
	const formatDate = (date: Date): string => {
		if (isMobile) {
			return dayjs(date).format("MM/DD/YY");
		}
		return dayjs(date).format("MMM DD, YYYY");
	};

	/**
	 * Mobile card view for projects
	 */
	const MobileProjectCard: React.FC<{ project: Project }> = ({ project }) => (
		<Card
			onClick={() => handleProjectClick(project.id)}
			sx={{
				mb: 2,
				cursor: "pointer",
				"&:hover": {
					boxShadow: theme.shadows[4],
					transform: "translateY(-1px)",
				},
				transition: theme.transitions.create(["box-shadow", "transform"], {
					duration: theme.transitions.duration.short,
				}),
			}}
		>
			<CardContent sx={{ p: 3 }}>
				<Stack spacing={2}>
					{/* Project name and status */}
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
						}}
					>
						<Typography variant="h6" fontWeight={600} sx={{ flex: 1, mr: 2 }}>
							{project.name}
						</Typography>
						<Chip
							label={getStatusLabel(project.status)}
							color={getStatusColor(project.status)}
							size="small"
							sx={{ fontWeight: 500 }}
						/>
					</Box>

					{/* Dates */}
					<Stack spacing={1}>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<Typography
								variant="body2"
								color="text.secondary"
								fontWeight={500}
							>
								Start Date:
							</Typography>
							<Typography variant="body2" color="text.primary">
								{project.startDate && formatDate(project.startDate)}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<Typography
								variant="body2"
								color="text.secondary"
								fontWeight={500}
							>
								End Date:
							</Typography>
							<Typography variant="body2" color="text.primary">
								{project.endDate && formatDate(project.endDate)}
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);

	const handleDeleteClick = (project: Project) => {
		setSelectedProject(project);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedProject) return;
		setDeleting(true);
		try {
			await deleteProject(selectedProject.id);
			setDeleteDialogOpen(false);
			setSelectedProject(null);
			if (onRetry) onRetry(); // Refresh list if possible
		} catch (err) {
			// Optionally handle error (e.g., show notification)
		} finally {
			setDeleting(false);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setSelectedProject(null);
	};

	// Handle loading state
	if (loading) {
		return (
			<Paper sx={{ boxShadow: 1, borderRadius: 1 }}>
				<LoadingState message="Loading projects..." size="medium" />
			</Paper>
		);
	}

	// Handle error state
	if (error) {
		return (
			<Paper sx={{ boxShadow: 1, borderRadius: 1 }}>
				<ErrorState
					title="Failed to load projects"
					description={error}
					onRetry={onRetry}
					showRetry={!!onRetry}
				/>
			</Paper>
		);
	}

	// Handle empty state or invalid projects data
	if (!projects || !Array.isArray(projects) || projects.length === 0) {
		return (
			<Paper sx={{ boxShadow: 1, borderRadius: 1 }}>
				<EmptyState
					title="No projects found"
					description="There are no projects matching your current filter. Try adjusting your filters or create a new project to get started."
					icon={FolderOpenIcon}
				/>
			</Paper>
		);
	}

	// Mobile card layout
	if (isMobile) {
		return (
			<Box>
				{projects.map((project) => (
					<MobileProjectCard key={project.id} project={project} />
				))}
			</Box>
		);
	}

	// Desktop/tablet table layout
	return (
		<React.Fragment>
			<TableContainer
				component={Paper}
				sx={{
					boxShadow: 1,
					borderRadius: 1,
				}}
			>
				<Table
					sx={{
						minWidth: isTablet ? 500 : 650,
					}}
					aria-label="projects table"
				>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
							{!isTablet && (
								<TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
							)}
							<TableCell sx={{ fontWeight: 600 }}>
								{isTablet ? "Dates" : "End Date"}
							</TableCell>
							<TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{projects.map((project) => (
							<TableRow
								key={project.id}
								onClick={() => handleProjectClick(project.id)}
								sx={{
									cursor: "pointer",
									"&:last-child td, &:last-child th": { border: 0 },
									"&:hover": {
										backgroundColor: "action.hover",
									},
									transition: theme.transitions.create(["background-color"], {
										duration: theme.transitions.duration.short,
									}),
								}}
							>
								<TableCell component="th" scope="row">
									<Typography variant="body2" fontWeight={500}>
										{project.name}
									</Typography>
								</TableCell>
								{!isTablet && (
									<TableCell>
										<Typography variant="body2" color="text.secondary">
											{project.startDate && formatDate(project.startDate)}
										</Typography>
									</TableCell>
								)}
								<TableCell>
									{isTablet ? (
										<Stack spacing={0.5}>
											<Typography
												variant="body2"
												color="text.secondary"
												fontSize="0.75rem"
											>
												Start:{" "}
												{project.startDate && formatDate(project.startDate)}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												fontSize="0.75rem"
											>
												End: {project.endDate && formatDate(project.endDate)}
											</Typography>
										</Stack>
									) : (
										<Typography variant="body2" color="text.secondary">
											{project.endDate && formatDate(project.endDate)}
										</Typography>
									)}
								</TableCell>
								<TableCell>
									<Chip
										label={getStatusLabel(project.status)}
										color={getStatusColor(project.status)}
										size="small"
										sx={{
											fontWeight: 500,
											minWidth: isTablet ? 70 : 80,
											fontSize: isTablet ? "0.7rem" : "0.75rem",
										}}
									/>
								</TableCell>
								<TableCell>
									<ListItemIcon
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteClick(project);
										}}
										sx={{
											minWidth: isMobile ? 56 : 0,
											justifyContent: "center",
											color: "#e54141",
											"& .MuiSvgIcon-root": {
												fontSize: isMobile ? "1.5rem" : "1.25rem",
											},
											transition: prefersReducedMotion
												? "none"
												: theme.transitions.create(["transform"], {
														duration: theme.transitions.duration.shorter,
														easing: theme.transitions.easing.easeInOut,
													}),
											...(!isMobile && {
												"&:hover": {
													transform: prefersReducedMotion
														? "none"
														: "translateX(2px)",
												},
											}),
										}}
									>
										<DeleteIcon />
									</ListItemIcon>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<DialogComponent
				open={deleteDialogOpen}
				title="Delete Project"
				message={`Are you sure you want to delete the project '${selectedProject?.name}'? This action cannot be undone.`}
				onConfirm={handleDeleteConfirm}
				onClose={handleDeleteCancel}
				confirmText={deleting ? "Deleting..." : "Confirm"}
				cancelText="Cancel"
			/>
		</React.Fragment>
	);
};

export default ProjectsTable;
