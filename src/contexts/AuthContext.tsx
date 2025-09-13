import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import {
	getAuthToken,
	getAuthUser,
	storeAuthData,
	clearAuthData,
} from "../utils/localStorage";
import { authApi, verifyToken } from "../services/authService";

// Types for authentication context
export interface User {
	id: string;
	providerId: string;
	provider: "github" | "google";
	username: string;
	displayName: string;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	email?: string;
	profilePictureUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (token: string, user: User) => void;
	logout: () => Promise<void>;
	refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize auth state from localStorage
	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const storedToken = getAuthToken();
				const storedUser = getAuthUser();

				if (storedToken && storedUser) {
					// Verify token is still valid by making a test request
					try {
						authApi.defaults.headers.common["Authorization"] =
							`Bearer ${storedToken}`;

						// Test the token with a simple API call
						await verifyToken();

						setToken(storedToken);
						setUser(storedUser as unknown as User);
					} catch (error) {
						// Token is invalid, clear stored data
						console.warn("Stored token is invalid, clearing auth data");
						clearAuthData();
						delete authApi.defaults.headers.common["Authorization"];
					}
				}
			} catch (error) {
				console.error("Error initializing auth:", error);
				clearAuthData();
			} finally {
				setIsLoading(false);
			}
		};

		initializeAuth();
	}, []);

	// Login function
	const login = (newToken: string, newUser: User) => {
		setToken(newToken);
		setUser(newUser);
		storeAuthData(newToken, newUser as any);

		// Set authorization header for future requests
		authApi.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
	};

	// Logout function
	const logout = async () => {
		try {
			// Call backend logout endpoint if token exists
			if (token) {
				await authApi.post("/logout");
			}
		} catch (error) {
			console.warn("Logout API call failed:", error);
			// Continue with local logout even if API call fails
		} finally {
			// Clear local state and storage
			setToken(null);
			setUser(null);
			clearAuthData();
			delete authApi.defaults.headers.common["Authorization"];
		}
	};

	// Refresh authentication
	const refreshAuth = async (): Promise<boolean> => {
		try {
			const storedToken = getAuthToken();
			if (!storedToken) {
				return false;
			}

			// Verify current token
			authApi.defaults.headers.common["Authorization"] =
				`Bearer ${storedToken}`;
			const response = await verifyToken();

			if (response.valid) {
				return true;
			} else {
				// Token is invalid, clear auth data
				await logout();
				return false;
			}
		} catch (error) {
			console.error("Token refresh failed:", error);
			await logout();
			return false;
		}
	};

	const value: AuthContextType = {
		user,
		token,
		isAuthenticated: !!token,
		isLoading,
		login,
		logout,
		refreshAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
