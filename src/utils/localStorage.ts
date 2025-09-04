/**
 * Centralized localStorage utility for authentication data management
 */

// Keys for localStorage
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'user';

/**
 * Store authentication token and user data in localStorage
 */
export const storeAuthData = (token: string, user: Record<string, unknown>): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

/**
 * Retrieve stored authentication token
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Retrieve stored user data
 */
export const getAuthUser = (): Record<string, unknown> | null => {
    const user = localStorage.getItem(USER_DATA_KEY);
    return user ? JSON.parse(user) : null;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Check if user is authenticated by verifying token existence
 */
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};