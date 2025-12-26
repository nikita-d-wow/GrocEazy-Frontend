import axios from 'axios';
import { API_BASE } from '../config';
import { store } from '../redux/store';
import { AUTH_LOGOUT } from '../redux/types/authTypes';
import { AUTH_KEYS } from '../constants/auth';

const api = axios.create({
  baseURL: API_BASE, // e.g. http://localhost:4000
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // No longer needed for cookie-based auth, but harmless if kept. Removing for clarity as per prompt.
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
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

    // Check if error is 401 and we haven't retried yet
    // Also skip auth endpoints to avoid infinite loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call Refresh Endpoint
        // Pass the OLD Access Token in the header (if available) for blacklisting
        const oldAccess = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);

        const res = await axios.post(`${API_BASE}/api/auth/refresh`,
          { refreshToken },
          {
            headers: {
              Authorization: oldAccess ? `Bearer ${oldAccess}` : undefined,
              'Content-Type': 'application/json'
            }
          }
        );

        // Save New Tokens
        const { accessToken, refreshToken: newRefresh } = res.data;
        localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
        // Sometimes backend might rotate refresh token too
        if (newRefresh) {
          localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, newRefresh);
        }

        // Retry Original Request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh Failed (Expired or Invalid) -> Logout User
        console.error("Session expired:", refreshError);

        // Clear Storage
        localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(AUTH_KEYS.USER);

        // Dispatch Logout
        store.dispatch({ type: AUTH_LOGOUT });

        // Redirect
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
