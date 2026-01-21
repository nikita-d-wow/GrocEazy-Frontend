import type { AxiosError } from 'axios';
import type { AppDispatch } from '../store';
import * as couponApi from '../../services/couponApi';
import {
  setCoupons,
  setLoading,
  setError,
  setValidation,
  addCoupon,
  updateCouponInState,
  removeCouponFromState,
} from '../reducers/couponReducer';

export const fetchCoupons = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await couponApi.getCoupons();
    dispatch(setCoupons(data));
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(
      setError(err.response?.data?.message || 'Failed to fetch coupons')
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const createCoupon = (data: any) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const coupon = await couponApi.createCoupon(data);
    dispatch(addCoupon(coupon));
    return coupon;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(
      setError(err.response?.data?.message || 'Failed to create coupon')
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateCoupon =
  (id: string, data: any) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const coupon = await couponApi.updateCoupon(id, data);
      dispatch(updateCouponInState(coupon));
      return coupon;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        setError(err.response?.data?.message || 'Failed to update coupon')
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteCoupon = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await couponApi.deleteCoupon(id);
    dispatch(removeCouponFromState(id));
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(
      setError(err.response?.data?.message || 'Failed to delete coupon')
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const validateCoupon =
  (params: {
    code: string;
    cartTotal: number;
    items?: any[];
    platform?: string;
  }) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const result = await couponApi.validateCoupon(params);
      dispatch(setValidation({ ...result, code: params.code }));
      return result;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        setValidation({
          valid: false,
          discountAmount: 0,
          message: err.response?.data?.message || 'Validation failed',
        })
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const clearCouponValidation = () => (dispatch: AppDispatch) => {
  dispatch(setValidation(null));
};
