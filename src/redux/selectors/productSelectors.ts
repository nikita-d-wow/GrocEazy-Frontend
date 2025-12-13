import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Memoized selector to prevent unnecessary re-renders
export const selectProducts = createSelector(
  [(state: RootState) => state.product.products],
  (products) => products ?? []
);

export const selectProductLoading = (state: RootState) => state.product.loading;

export const selectProductError = (state: RootState) => state.product.error;
