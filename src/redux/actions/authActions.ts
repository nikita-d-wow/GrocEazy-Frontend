// src/redux/actions/authActions.ts
import type { Dispatch } from 'redux';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
} from '../types/authTypes';
import type {
  AuthActionTypes,
  ILoginResponse,
  IUser,
} from '../types/authTypes';
import { API_BASE } from '../../config.ts';

type LoginPayload = { email: string; password: string };

// ... rest of file unchanged

export const login = (payload: LoginPayload) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        credentials: 'include', // important: allow cookies (refresh token set by server)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res
          .json()
          .catch(() => ({ message: res.statusText }));
        throw new Error(errorBody.message || 'Login failed');
      }

      const data: ILoginResponse = await res.json();

      // store accessToken in localStorage and redux
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: { accessToken: data.accessToken, user: data.user as IUser },
      });
    } catch (err: any) {
      dispatch({
        type: AUTH_LOGIN_FAILURE,
        payload: { error: err.message || 'Network error' },
      });
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // clear server-side session cookie
      });
    } catch {
      // ignore network error on logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_LOGOUT });
  };
};
