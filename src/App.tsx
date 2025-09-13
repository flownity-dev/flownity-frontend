import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import "./App.css";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { Sidebar } from "./components/Sidebar";
import { ErrorBoundary, ErrorState } from "./components/Common";
import Diagram from "./components/Diagram";
import Login from "./components/Login";
import OAuthCallback from "./components/OAuthCallback";
import HomePage from "./components/Homepage";
import { Projects } from "./components/Projects";
import { ProjectDetailView } from "./components/Projects/ProjectDetailView";
import { TaskGroups, TaskGroupDetailView } from "./components/TaskGroups";
import ProtectedRoute from "./components/ProtectedRoute";

// Main layout component that uses sidebar context - for authenticated routes only
function MainLayout({ children }: { children: React.ReactNode }) {
	const theme = useTheme();
	const { sidebarState } = useSidebar();
	const { isCollapsed, isMobile } = sidebarState;

	// Calculate main content margin based on sidebar state
	const getMainContentMargin = () => {
		if (isMobile) {
			return 0; // No margin on mobile as sidebar overlays
		}
		return isCollapsed ? 5 : 5; // Collapsed or expanded width
	};

	// Calculate main content width for better responsive behavior
	const getMainContentWidth = () => {
		if (isMobile) {
			return "100vw"; // Full width on mobile
		}
		return `calc(100vw - ${getMainContentMargin()}px)`;
	};

	return (
		<Box sx={{ display: "flex", minHeight: "100vh" }}>
			<Sidebar />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					marginLeft: `${getMainContentMargin()}px`,
					transition: theme.transitions.create(["margin-left"], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.enteringScreen,
					}),
					minHeight: "100vh",
					width: getMainContentWidth(),
					// Prevent content from being selectable when mobile sidebar is open
					...(isMobile &&
						!isCollapsed && {
							pointerEvents: "none",
							userSelect: "none",
						}),
					// Smooth transitions for responsive changes
					"@media (max-width: 768px)": {
						marginLeft: "0 !important",
						width: "100vw !important",
					},
				}}
			>
				{children}
			</Box>
		</Box>
	);
}

// Component to handle default route redirection
function DefaultRoute() {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return null; // Let AuthProvider handle loading state
	}

	return isAuthenticated ? (
		<Navigate to="/dashboard" replace />
	) : (
		<Navigate to="/login" replace />
	);
}

function App() {
	return (
		<ThemeProvider defaultMode="light">
			<AuthProvider>
				<Router>
					<Routes>
						{/* Default route - redirect based on auth status */}
						<Route path="/" element={<DefaultRoute />} />

						{/* Login route */}
						<Route path="/login" element={<Login />} />

						{/* OAuth callback route */}
						<Route path="/auth/callback" element={<OAuthCallback />} />

						{/* Protected routes with sidebar layout */}
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<SidebarProvider>
										<MainLayout>
											<HomePage />
										</MainLayout>
									</SidebarProvider>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/project"
							element={
								<ProtectedRoute>
									<SidebarProvider>
										<MainLayout>
											<Projects />
										</MainLayout>
									</SidebarProvider>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/project/:id"
							element={
								<ProtectedRoute>
									<SidebarProvider>
										<MainLayout>
											<ErrorBoundary
												fallback={
													<Box sx={{ p: 4 }}>
														<ErrorState
															title="Project View Error"
															description="Failed to load project detail view. Please try refreshing the page."
															onRetry={() => window.location.reload()}
															actionLabel="Refresh Page"
														/>
													</Box>
												}
											>
												<ProjectDetailView />
											</ErrorBoundary>
										</MainLayout>
									</SidebarProvider>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/task-groups"
							element={
								<ProtectedRoute>
									<SidebarProvider>
										<MainLayout>
											<TaskGroups />
										</MainLayout>
									</SidebarProvider>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/task-groups/:id"
							element={
								<ProtectedRoute>
									<SidebarProvider>
										<MainLayout>
											<ErrorBoundary
												fallback={
													<Box sx={{ p: 4 }}>
														<ErrorState
															title="Task Group View Error"
															description="Failed to load task group detail view. Please try refreshing the page."
															onRetry={() => window.location.reload()}
															actionLabel="Refresh Page"
														/>
													</Box>
												}
											>
												<TaskGroupDetailView />
											</ErrorBoundary>
										</MainLayout>
									</SidebarProvider>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/diagram/:id"
							element={
								<ProtectedRoute>
									<SidebarProvider>
										<Box sx={{ display: "flex", minHeight: "100vh" }}>
											<Sidebar />
											<Box
												component="main"
												sx={{
													flexGrow: 1,
													width: "100%",
													height: "100vh",
													margin: 0,
													padding: 0,
													overflow: "hidden",
												}}
											>
												<Diagram />
											</Box>
										</Box>
									</SidebarProvider>
								</ProtectedRoute>
							}
						/>

						{/* Catch all - redirect to login */}
						<Route path="*" element={<Navigate to="/login" replace />} />
					</Routes>
				</Router>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
