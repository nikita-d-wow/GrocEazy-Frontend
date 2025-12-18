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
  action: AuthActionTypes
): AuthState {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        accessToken: action.payload.accessToken,
        user: { ...state.user, ...action.payload.user }, // Merge to keep existing fields if any, though usually login replaces all
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
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: state.user
          ? { ...state.user, ...action.payload }
          : action.payload,
      };
    case 'ADD_ADDRESS_SUCCESS': {
      const currentAddresses = state.user?.addresses || [];
      const newAddress = action.payload;
      // Prevent duplicates if address with same ID already exists
      const exists = currentAddresses.some(
        (addr) => addr._id === newAddress._id
      );

      if (exists) {
        // Or update it? Usually ADD implies new. If exists, ignore or update.
        // Better: Replace it.
        return {
          ...state,
          user: state.user
            ? {
                ...state.user,
                addresses: currentAddresses.map((addr) =>
                  addr._id === newAddress._id ? newAddress : addr
                ),
              }
            : null,
        };
      }

      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              addresses: [...currentAddresses, newAddress],
            }
          : null,
      };
    }
    case 'UPDATE_ADDRESS_SUCCESS':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              addresses: (state.user.addresses || []).map((addr) => {
                if (addr._id === action.payload._id) {
                  return action.payload;
                }
                // If the updated address is set to default, ensure others are not
                if (action.payload.isDefault) {
                  return { ...addr, isDefault: false };
                }
                return addr;
              }),
            }
          : null,
      };
    case 'DELETE_ADDRESS_SUCCESS':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              addresses: (state.user.addresses || []).filter(
                (addr) => addr._id !== action.payload.addressId
              ),
            }
          : null,
      };
    default:
      return state;
  }
}
