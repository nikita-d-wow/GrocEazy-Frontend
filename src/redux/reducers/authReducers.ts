// src/redux/reducers/authReducer.ts
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
} from '../types/authTypes';

import type { AuthState, AuthActionTypes } from '../types/authTypes';

const userJSON =
  typeof window !== 'undefined' ? localStorage.getItem('user') : null;
const token =
  typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

const initialState: AuthState = {
  loading: false,
  accessToken: token || null,
  user: userJSON ? JSON.parse(userJSON) : null,
  error: null,
};

export function authReducer(
  state = initialState,
  action: AuthActionTypes,
): AuthState {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        accessToken: action.payload.accessToken,
        user: action.payload.user,
        error: null,
      };
    case AUTH_LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case AUTH_LOGOUT:
      return { ...initialState, loading: false, accessToken: null, user: null };
    case AUTH_REGISTER_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_REGISTER_SUCCESS:
      return { ...state, loading: false, error: null };
    case AUTH_REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
}
