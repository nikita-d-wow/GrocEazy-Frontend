import type { Dispatch } from 'redux';
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_DETAILS_REQUEST,
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS_FAILURE,
  UPDATE_USER_STATUS_REQUEST,
  UPDATE_USER_STATUS_SUCCESS,
  UPDATE_USER_STATUS_FAILURE,
  type UserActionTypes,
  type User,
  type Pagination,
} from '../types/userTypes';
import api from '../../services/api';

// Fetch Users (with pagination & role filter & search)
export const getUsers = (page = 1, role = '', search = '') => {
  return async (dispatch: Dispatch<UserActionTypes>) => {
    dispatch({ type: FETCH_USERS_REQUEST });
    try {
      // Build query string
      let queryString = `/users?page=${page}&limit=10`;
      if (role) {
        queryString += `&role=${role}`;
      }
      if (search) {
        queryString += `&search=${encodeURIComponent(search)}`;
      }

      const { data } = await api.get<{ users: User[]; pagination: Pagination }>(
        queryString
      );
      dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch users';
      dispatch({ type: FETCH_USERS_FAILURE, payload: errorMessage });
    }
  };
};

// Get User Details
export const getUserDetails = (id: string) => {
  return async (dispatch: Dispatch<UserActionTypes>) => {
    dispatch({ type: FETCH_USER_DETAILS_REQUEST });
    try {
      const { data } = await api.get<User>(`/users/${id}`);
      dispatch({ type: FETCH_USER_DETAILS_SUCCESS, payload: data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch user details';
      dispatch({ type: FETCH_USER_DETAILS_FAILURE, payload: errorMessage });
    }
  };
};

// Update User Status (Block/Unblock/Delete)
export const updateUserStatus = (
  id: string,
  updates: { isActive?: boolean; isDeleted?: boolean }
) => {
  return async (dispatch: Dispatch<UserActionTypes>) => {
    dispatch({ type: UPDATE_USER_STATUS_REQUEST });
    try {
      const { data } = await api.patch<User>(`/users/${id}/status`, updates);
      dispatch({ type: UPDATE_USER_STATUS_SUCCESS, payload: data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update user status';
      dispatch({ type: UPDATE_USER_STATUS_FAILURE, payload: errorMessage });
    }
  };
};
