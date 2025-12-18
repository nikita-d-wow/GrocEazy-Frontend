import type { Dispatch } from 'redux';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  UPDATE_PROFILE_SUCCESS,
  ADD_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_SUCCESS,
} from '../types/authTypes';
import type { IAddress } from '../types/authTypes';

export const fetchUserProfile = () => {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await api.get<any>('/api/users/profile');
      const user = data.user || data;

      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: user,
      });

      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Fetch profile error', error);
      // Silent fail or toast? Silent for now as it's often a background sync
    }
  };
};

export const updateProfile = (data: { name: string; phone: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data: responseData } = await api.put<any>(
        '/api/users/profile',
        data
      );

      const updatedUser = responseData.user || responseData;

      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: updatedUser,
      });

      // Update local storage to keep it in sync
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const mergedUser = { ...user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(mergedUser));
      } else {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Update profile error', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };
};

export const addAddress = (address: Partial<IAddress>) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // Guide: POST /api/users/address
      const { data } = await api.post<any>('/api/users/address', address);

      // Robust handling: Backend might return { address: ... } or { newAddress: ... } or just the address
      const newAddress = data.address || data.newAddress || data;

      dispatch({
        type: ADD_ADDRESS_SUCCESS,
        payload: newAddress,
      });

      // Refetch profile to ensure consistency
      await dispatch(fetchUserProfile());

      toast.success('Address added successfully');
      return newAddress;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Add address error', error);
      toast.error(error.response?.data?.message || 'Failed to add address');
      throw error;
    }
  };
};

export const updateAddress = (
  addressId: string,
  addressData: Partial<IAddress>
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // Guide: PUT /api/users/address/:addressId
      const { data } = await api.put<any>(
        `/api/users/address/${addressId}`,
        addressData
      );

      const updatedAddress = data.address || data.updatedAddress || data;

      dispatch({
        type: UPDATE_ADDRESS_SUCCESS,
        payload: updatedAddress,
      });

      // Refetch profile to ensure consistency
      await dispatch(fetchUserProfile());

      toast.success('Address updated successfully');
      return updatedAddress;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Update address error', error);
      toast.error(error.response?.data?.message || 'Failed to update address');
      throw error;
    }
  };
};

export const deleteAddress = (addressId: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // Guide: DELETE /api/users/address/:addressId
      await api.delete(`/api/users/address/${addressId}`);

      dispatch({
        type: DELETE_ADDRESS_SUCCESS,
        payload: { addressId },
      });

      // Refetch profile to ensure consistency
      await dispatch(fetchUserProfile());

      toast.success('Address deleted successfully');
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Delete address error', error);
      toast.error(error.response?.data?.message || 'Failed to delete address');
      throw error;
    }
  };
};
