import type { Address } from './orderTypes'; // Re-use address type

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'manager';
  phone?: string;
  addresses: Address[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

export interface UserState {
  users: User[];
  pagination: Pagination | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// Action Types
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const FETCH_USER_DETAILS_REQUEST = 'FETCH_USER_DETAILS_REQUEST';
export const FETCH_USER_DETAILS_SUCCESS = 'FETCH_USER_DETAILS_SUCCESS';
export const FETCH_USER_DETAILS_FAILURE = 'FETCH_USER_DETAILS_FAILURE';

export const UPDATE_USER_STATUS_REQUEST = 'UPDATE_USER_STATUS_REQUEST';
export const UPDATE_USER_STATUS_SUCCESS = 'UPDATE_USER_STATUS_SUCCESS';
export const UPDATE_USER_STATUS_FAILURE = 'UPDATE_USER_STATUS_FAILURE';

interface FetchUsersRequestAction {
  type: typeof FETCH_USERS_REQUEST;
}
interface FetchUsersSuccessAction {
  type: typeof FETCH_USERS_SUCCESS;
  payload: { users: User[]; pagination: Pagination };
}
interface FetchUsersFailureAction {
  type: typeof FETCH_USERS_FAILURE;
  payload: string;
}

interface FetchUserDetailsRequestAction {
  type: typeof FETCH_USER_DETAILS_REQUEST;
}
interface FetchUserDetailsSuccessAction {
  type: typeof FETCH_USER_DETAILS_SUCCESS;
  payload: User;
}
interface FetchUserDetailsFailureAction {
  type: typeof FETCH_USER_DETAILS_FAILURE;
  payload: string;
}

interface UpdateUserStatusRequestAction {
  type: typeof UPDATE_USER_STATUS_REQUEST;
}
interface UpdateUserStatusSuccessAction {
  type: typeof UPDATE_USER_STATUS_SUCCESS;
  payload: User; // The updated user
}
interface UpdateUserStatusFailureAction {
  type: typeof UPDATE_USER_STATUS_FAILURE;
  payload: string;
}

export type UserActionTypes =
  | FetchUsersRequestAction
  | FetchUsersSuccessAction
  | FetchUsersFailureAction
  | FetchUserDetailsRequestAction
  | FetchUserDetailsSuccessAction
  | FetchUserDetailsFailureAction
  | UpdateUserStatusRequestAction
  | UpdateUserStatusSuccessAction
  | UpdateUserStatusFailureAction;
