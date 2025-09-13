import axios from 'axios';

// TypeScript interfaces for API responses
export interface LogoutResponse {
    success: boolean;
    message?: string;
}

export interface RefreshResponse {
    success: boolean;
    message: string;
    token: string;
}

export interface TokenVerifyResponse {
    valid: boolean;
    user?: any;
    message?: string;
}

// Configure axios instance with base URL and headers
const authApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // We're using JWT tokens, not cookies
});

// Add request interceptor to include auth token
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Generate OAuth URLs - let backend handle the callback
const generateOAuthUrl = (provider: 'github' | 'google'): string => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`+'/auth';
    return `${baseUrl}/${provider}`;
};

// GitHub OAuth functions
export const initiateGitHubAuth = (): void => {
    window.location.href = generateOAuthUrl('github');
};

// Google OAuth functions  
export const initiateGoogleAuth = (): void => {
    window.location.href = generateOAuthUrl('google');
};

// Logout function
export const logout = async (): Promise<LogoutResponse> => {
    try {
        const response = await authApi.post<LogoutResponse>('/auth/logout');
        return response.data;
    } catch (error) {
        // Even if logout fails on server, we should clear local data
        return { success: true, message: 'Logged out locally' };
    }
};

// Token verification function
export const verifyToken = async (): Promise<TokenVerifyResponse> => {
    const response = await authApi.get<TokenVerifyResponse>('/auth/verify-token');
    return response.data;
};

// Token refresh function (if your backend supports it)
export const refreshToken = async (): Promise<RefreshResponse> => {
    const response = await authApi.post<RefreshResponse>('/auth/refresh');
    return response.data;
};

// Get current user profile
export const getCurrentUser = async () => {
    const response = await authApi.get('/api/v1/users/profile');
    return response.data;
};

export { authApi };