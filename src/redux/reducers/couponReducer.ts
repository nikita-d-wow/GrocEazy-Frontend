import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Coupon, CouponState } from '../types/couponTypes';

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
  validation: null,
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCoupons(state, action: PayloadAction<Coupon[]>) {
      state.coupons = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setValidation(state, action: PayloadAction<CouponState['validation']>) {
      state.validation = action.payload;
    },
    addCoupon(state, action: PayloadAction<Coupon>) {
      state.coupons.unshift(action.payload);
    },
    updateCouponInState(state, action: PayloadAction<Coupon>) {
      const index = state.coupons.findIndex(
        (c) => c._id === action.payload._id
      );
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
    },
    removeCouponFromState(state, action: PayloadAction<string>) {
      state.coupons = state.coupons.filter((c) => c._id !== action.payload);
    },
  },
});

export const {
  setCoupons,
  setLoading,
  setError,
  setValidation,
  addCoupon,
  updateCouponInState,
  removeCouponFromState,
} = couponSlice.actions;

export default couponSlice.reducer;
