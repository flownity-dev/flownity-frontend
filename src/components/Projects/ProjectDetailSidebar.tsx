import React from "react";
import {
	Drawer,
	Box,
	IconButton,
	Typography,
	Paper,
	Divider,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";
import type { ProjectDetailSidebarProps } from "../../types/common.types";

/**
 * ProjectDetailSidebar component provides a collapsible right sidebar
 * for displaying additional project information in the project detail view.
 *
 * Features:
 * - Collapsible drawer with smooth animations
 * - Responsive design for different screen sizes
 * - Empty content area ready for future project information
 * - Toggle functionality with proper state management
 */
const ProjectDetailSidebar: React.FC<ProjectDetailSidebarProps> = ({
	isCollapsed,
	onToggle,
	project,
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// Sidebar configuration
	const sidebarWidth = 320;
	const collapsedWidth = 0;

	return (
		<Drawer
			variant={isMobile ? "temporary" : "persistent"}
			anchor="right"
			open={!isCollapsed}
			onClose={onToggle}
			ModalProps={{
				keepMounted: true, // Better open performance on mobile
			}}
			sx={{
				width: isCollapsed ? collapsedWidth : sidebarWidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: sidebarWidth,
					boxSizing: "border-box",
					position: isMobile ? "fixed" : "relative",
					height: "100%",
					border: "none",
					borderLeft: isMobile ? "none" : `1px solid ${theme.palette.divider}`,
					transition: theme.transitions.create(
						["width", "margin", "transform"],
						{
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}
					),
					// Mobile-specific styles
					...(isMobile && {
						top: 0,
						zIndex: theme.zIndex.drawer,
						boxShadow: theme.shadows[8],
					}),
				},
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					overflow: "hidden",
				}}
			>
				{/* Sidebar Header with Toggle Button */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						p: { xs: 2, sm: 2.5 },
						borderBottom: `1px solid ${theme.palette.divider}`,
						minHeight: { xs: 56, sm: 64 },
						backgroundColor: "background.paper",
					}}
				>
					<Typography
						variant="h6"
						component="h2"
						sx={{
							fontWeight: 600,
							fontSize: {
								xs: "1rem", // 16px on mobile
								sm: "1.125rem", // 18px on tablet+
							},
						}}
					>
						Project Info
					</Typography>
					<IconButton
						onClick={onToggle}
						size={isMobile ? "medium" : "small"}
						sx={{
							color: theme.palette.text.secondary,
							"&:hover": {
								backgroundColor: theme.palette.action.hover,
							},
						}}
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						{isCollapsed ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</Box>

				{/* Sidebar Content Area */}
				<Box
					sx={{
						flex: 1,
						p: { xs: 2, sm: 2.5 },
						overflow: "auto",
						backgroundColor: "background.default",
					}}
				>
					{/* Project Basic Info Section */}
					<Paper
						elevation={0}
						sx={{
							p: { xs: 1.5, sm: 2 },
							mb: { xs: 2, sm: 3 },
							backgroundColor: "background.paper",
							border: `1px solid ${theme.palette.divider}`,
							borderRadius: 2,
						}}
					>
						<Typography
							variant="subtitle2"
							color="text.secondary"
							gutterBottom
							sx={{
								fontSize: {
									xs: "0.75rem", // 12px on mobile
									sm: "0.875rem", // 14px on tablet+
								},
								fontWeight: 600,
								textTransform: "uppercase",
								letterSpacing: 0.5,
							}}
						>
							Project Details
						</Typography>
						<Typography
							variant="body2"
							sx={{
								mb: 1,
								fontSize: {
									xs: "0.75rem", // 12px on mobile
									sm: "0.875rem", // 14px on tablet+
								},
							}}
						>
							<strong>Status:</strong> {project.status}
						</Typography>
						<Typography
							variant="body2"
							sx={{
								mb: 1,
								fontSize: {
									xs: "0.75rem", // 12px on mobile
									sm: "0.875rem", // 14px on tablet+
								},
							}}
						>
							<strong>Start Date:</strong>{" "}
							{project.startDate && project.startDate.toLocaleDateString()}
						</Typography>
						<Typography
							variant="body2"
							sx={{
								fontSize: {
									xs: "0.75rem", // 12px on mobile
									sm: "0.875rem", // 14px on tablet+
								},
							}}
						>
							<strong>End Date:</strong>{" "}
							{project.endDate && project.endDate.toLocaleDateString()}
						</Typography>
					</Paper>

					<Divider sx={{ my: { xs: 2, sm: 3 } }} />
				</Box>
			</Box>
		</Drawer>
	);
};

export default ProjectDetailSidebar;
