import axios from 'axios';
import { API_BASE } from '../config';
import { store } from '../redux/store';
import { AUTH_LOGOUT } from '../redux/types/authTypes';

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

// Variables to handle concurrent refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Helper to process the queue
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Filter out auth endpoints to avoid infinite loops
    // Also user should not be refreshing if they are just tying to login
    if (
      !originalRequest ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/google') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        // According to specs: POST /auth/refresh (cookie based)
        const { data } = await api.post('/api/auth/refresh');

        // Update local storage
        localStorage.setItem('accessToken', data.accessToken);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Process queue with new token
        processQueue(null, data.accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g. invalid/expired refresh token)
        processQueue(refreshError, null);

        // CLEAR EVERYTHING
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Dispatch Logout Action
        store.dispatch({ type: AUTH_LOGOUT });

        // Redirect to Login
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
