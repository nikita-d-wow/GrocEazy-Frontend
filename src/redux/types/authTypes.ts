// src/redux/types/authTypes.ts
export interface IUser {
  id: string;
  email: string;
  role: 'customer' | 'manager' | 'admin' | string;
  name?: string;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}

export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

interface AuthLoginRequestAction {
  type: typeof AUTH_LOGIN_REQUEST;
}
interface AuthLoginSuccessAction {
  type: typeof AUTH_LOGIN_SUCCESS;
  payload: { accessToken: string; user: IUser };
}
interface AuthLoginFailureAction {
  type: typeof AUTH_LOGIN_FAILURE;
  payload: { error: string };
}
interface AuthLogoutAction {
  type: typeof AUTH_LOGOUT;
}

export type AuthActionTypes =
  | AuthLoginRequestAction
  | AuthLoginSuccessAction
  | AuthLoginFailureAction
  | AuthLogoutAction;

export interface AuthState {
  loading: boolean;
  accessToken?: string | null;
  user?: IUser | null;
  error?: string | null;
}
