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

// Configure axios instance with base URL and headers
const authApi = axios.create({
    baseURL: 'http://localhost:3000/auth',
    headers: {
        'Content-Type': 'application/json',
    }
});

// GitHub OAuth functions
export const initiateGitHubAuth = (): void => {
    window.location.href = `${authApi.defaults.baseURL}/github`;
};

// Google OAuth functions
export const initiateGoogleAuth = (): void => {
    window.location.href = `${authApi.defaults.baseURL}/google`;
};

// Logout function
export const logout = async (): Promise<LogoutResponse> => {
    const response = await authApi.post<LogoutResponse>('/logout');
    return response.data;
};

// Token refresh function
export const refreshToken = async (): Promise<RefreshResponse> => {
    const response = await authApi.post<RefreshResponse>('/refresh');
    return response.data;
};



export { authApi };