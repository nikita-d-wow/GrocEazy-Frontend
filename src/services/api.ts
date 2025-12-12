import axios from 'axios';
import { API_BASE } from '../config';

const api = axios.create({
    baseURL: API_BASE, // e.g. http://localhost:4000
    withCredentials: true, // Send cookies (refresh token)
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Use a custom property to avoid infinite loops
        // Use a custom property to avoid infinite loops
        // Also skip retry for auth endpoints (login/register) to avoid infinite loops on wrong credentials
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/register') &&
            !originalRequest.url?.includes('/auth/google')
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                // According to specs: POST /auth/refresh (cookie based)
                // Response should contain new accessToken and user
                const { data } = await api.post('/api/auth/refresh');

                // Update local storage
                localStorage.setItem('accessToken', data.accessToken);
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed (e.g. invalid/expired refresh token)
                // Clear local storage and let the app handle logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                // Optional: Redirect to login or dispatch logout action
                // For now, we reject so the calling code handles the failure
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
