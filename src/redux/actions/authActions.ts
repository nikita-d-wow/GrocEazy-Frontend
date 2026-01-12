// src/redux/actions/authActions.ts
import type { Dispatch } from 'redux';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
  AUTH_FORGOT_PASSWORD_REQUEST,
  AUTH_FORGOT_PASSWORD_SUCCESS,
  AUTH_RESET_PASSWORD_REQUEST,
  AUTH_RESET_PASSWORD_SUCCESS,
  AUTH_RESET_PASSWORD_FAILURE,
} from '../types/authTypes';
import type {
  AuthActionTypes,
  ILoginResponse,
  IUser,
} from '../types/authTypes';
import api from '../../services/api';
import { AUTH_KEYS } from '../../constants/auth';
import { verifyOtp } from '../../services/authService';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name: string; email: string; password: string };

export const login = (payload: LoginPayload) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    try {
      // API call using the axios instance
      const { data } = await api.post<ILoginResponse>('/auth/login', payload);

      // store accessToken in localStorage settings
      localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refreshToken);
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(data.user));

      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: { accessToken: data.accessToken, user: data.user as IUser },
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Login failed';
      dispatch({
        type: AUTH_LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
    }
  };
};

export const register = (payload: RegisterPayload) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_REGISTER_REQUEST });
    try {
      await api.post('/auth/register', payload);

      dispatch({ type: AUTH_REGISTER_SUCCESS });
      // Note: Registration doesn't auto-login per spec, so no token setting here.
      // The UI should redirect to Login.
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Registration failed';
      dispatch({
        type: AUTH_REGISTER_FAILURE,
        payload: { error: errorMessage },
      });
      throw err;
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
    // const accessToken = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);

    // Clean up locally FIRST
    localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER);

    // Dispatch logout to clear Redux state immediately to update UI
    dispatch({ type: AUTH_LOGOUT });

    try {
      // Attempt server-side logout (blacklist refresh token)
      if (refreshToken) {
        // Access token is automatically attached by interceptor if present
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout backend call failed', error); // eslint-disable-line no-console
    } finally {
      // Optional: Force reload to ensure clean state
      // window.location.reload();
    }
  };
};

// Google Login Action
export const googleLogin = (token: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    try {
      const { data } = await api.post<ILoginResponse>('/auth/google', {
        token,
      });

      localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refreshToken);
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(data.user));

      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: { accessToken: data.accessToken, user: data.user as IUser },
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Google login failed';
      dispatch({
        type: AUTH_LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
    }
  };
};

export const forgotPassword = (email: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_FORGOT_PASSWORD_REQUEST });
    try {
      await api.post('/auth/forgot-password', { email });
      dispatch({ type: AUTH_FORGOT_PASSWORD_SUCCESS });
    } catch {
      // Error handled by reducer/toast
    }
  };
};

export const resetPassword = (token: string, password: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_RESET_PASSWORD_REQUEST });
    try {
      await api.post('/auth/reset-password', { token, password });
      dispatch({ type: AUTH_RESET_PASSWORD_SUCCESS });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Reset password failed';
      dispatch({
        type: AUTH_RESET_PASSWORD_FAILURE,
        payload: { error: errorMessage },
      });
      throw err;
    }
  };
};

export const verifyOtpAction = (email: string, otp: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    try {
      const data = await verifyOtp({ email, otp });

      localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refreshToken);
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(data.user));

      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: { accessToken: data.accessToken, user: data.user as IUser },
      });
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'OTP Verification failed';
      dispatch({
        type: AUTH_LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      throw err;
    }
  };
};
