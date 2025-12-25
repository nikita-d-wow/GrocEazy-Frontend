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
  AUTH_FORGOT_PASSWORD_FAILURE,
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

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name: string; email: string; password: string };

export const login = (payload: LoginPayload) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    try {
      // API call using the axios instance (handles credentials automatically)
      const { data } = await api.post<ILoginResponse>(
        '/api/auth/login',
        payload
      );

      // store accessToken in localStorage settings
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

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
      await api.post('/api/auth/register', payload);

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
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    // Clear local storage immediately
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Dispatch logout to clear Redux state immediately to update UI
    dispatch({ type: AUTH_LOGOUT });

    try {
      // Attempt server-side logout (optional, best effort)
      if (refreshToken && accessToken) {
        await api.post(
          '/api/auth/logout',
          { refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
    } catch {
      // ignore network error on logout
    }
  };
};

// Google Login Action
export const googleLogin = (token: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    try {
      const { data } = await api.post<ILoginResponse>('/api/auth/google', {
        token,
      });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

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
      await api.post('/api/auth/forgot-password', { email });
      dispatch({ type: AUTH_FORGOT_PASSWORD_SUCCESS });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Forgot password failed';
      dispatch({
        type: AUTH_FORGOT_PASSWORD_FAILURE,
        payload: { error: errorMessage },
      });
      throw err;
    }
  };
};

export const resetPassword = (token: string, password: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_RESET_PASSWORD_REQUEST });
    try {
      await api.post('/api/auth/reset-password', { token, password });
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
