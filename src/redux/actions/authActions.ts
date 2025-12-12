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
      const { data } = await api.post<ILoginResponse>('/api/auth/login', payload);

      // store accessToken in localStorage settings
      localStorage.setItem('accessToken', data.accessToken);
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
    try {
      await api.post('/api/auth/logout');
    } catch {
      // ignore network error on logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_LOGOUT });
  };
};

// Google Login Action
export const googleLogin = (token: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    try {
      const { data } = await api.post<ILoginResponse>('/api/auth/google', { token });

      localStorage.setItem('accessToken', data.accessToken);
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
