// src/redux/types/authTypes.ts
export interface IUser {
  id: string;
  email: string;
  role: 'customer' | 'manager' | 'admin' | string;
  name?: string;
  phone?: string;
  addresses?: IAddress[];
  hasPassword?: boolean;
  isActive?: boolean;
}

export interface IAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}

export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const AUTH_REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
export const AUTH_REGISTER_FAILURE = 'AUTH_REGISTER_FAILURE';

export const AUTH_FORGOT_PASSWORD_REQUEST = 'AUTH_FORGOT_PASSWORD_REQUEST';
export const AUTH_FORGOT_PASSWORD_SUCCESS = 'AUTH_FORGOT_PASSWORD_SUCCESS';
export const AUTH_FORGOT_PASSWORD_FAILURE = 'AUTH_FORGOT_PASSWORD_FAILURE';

export const AUTH_RESET_PASSWORD_REQUEST = 'AUTH_RESET_PASSWORD_REQUEST';
export const AUTH_RESET_PASSWORD_SUCCESS = 'AUTH_RESET_PASSWORD_SUCCESS';
export const AUTH_RESET_PASSWORD_FAILURE = 'AUTH_RESET_PASSWORD_FAILURE';

export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const ADD_ADDRESS_SUCCESS = 'ADD_ADDRESS_SUCCESS';
export const UPDATE_ADDRESS_SUCCESS = 'UPDATE_ADDRESS_SUCCESS';
export const DELETE_ADDRESS_SUCCESS = 'DELETE_ADDRESS_SUCCESS';

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

interface AuthRegisterRequestAction {
  type: typeof AUTH_REGISTER_REQUEST;
}
interface AuthRegisterSuccessAction {
  type: typeof AUTH_REGISTER_SUCCESS;
}
interface AuthRegisterFailureAction {
  type: typeof AUTH_REGISTER_FAILURE;
  payload: { error: string };
}

interface AuthForgotPasswordRequestAction {
  type: typeof AUTH_FORGOT_PASSWORD_REQUEST;
}
interface AuthForgotPasswordSuccessAction {
  type: typeof AUTH_FORGOT_PASSWORD_SUCCESS;
}
interface AuthForgotPasswordFailureAction {
  type: typeof AUTH_FORGOT_PASSWORD_FAILURE;
  payload: { error: string };
}

interface AuthResetPasswordRequestAction {
  type: typeof AUTH_RESET_PASSWORD_REQUEST;
}
interface AuthResetPasswordSuccessAction {
  type: typeof AUTH_RESET_PASSWORD_SUCCESS;
}
interface AuthResetPasswordFailureAction {
  type: typeof AUTH_RESET_PASSWORD_FAILURE;
  payload: { error: string };
}

export type AuthActionTypes =
  | AuthLoginRequestAction
  | AuthLoginSuccessAction
  | AuthLoginFailureAction
  | AuthLogoutAction
  | AuthRegisterRequestAction
  | AuthRegisterSuccessAction
  | AuthRegisterFailureAction
  | AuthForgotPasswordRequestAction
  | AuthForgotPasswordSuccessAction
  | AuthForgotPasswordFailureAction
  | AuthResetPasswordRequestAction
  | AuthResetPasswordSuccessAction
  | AuthResetPasswordFailureAction
  | UpdateProfileSuccessAction
  | AddAddressSuccessAction
  | UpdateAddressSuccessAction
  | DeleteAddressSuccessAction;

interface UpdateProfileSuccessAction {
  type: typeof UPDATE_PROFILE_SUCCESS;
  payload: IUser; // The complete updated user object or partial? Guide says "merge returned data"
}

interface AddAddressSuccessAction {
  type: typeof ADD_ADDRESS_SUCCESS;
  payload: IAddress; // The new address
}

interface UpdateAddressSuccessAction {
  type: typeof UPDATE_ADDRESS_SUCCESS;
  payload: IAddress; // The updated address
}

interface DeleteAddressSuccessAction {
  type: typeof DELETE_ADDRESS_SUCCESS;
  payload: { addressId: string };
}

export interface AuthState {
  loading: boolean;
  accessToken?: string | null;
  user?: IUser | null;
  error?: string | null;
}
