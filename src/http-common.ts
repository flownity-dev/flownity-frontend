import axios from "axios";

const httpClient = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`+"/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor to include auth token
httpClient.interceptors.request.use(
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

// Add response interceptor to handle auth errors
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default httpClient;