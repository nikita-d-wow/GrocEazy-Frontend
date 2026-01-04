import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Memoized selector to prevent unnecessary re-renders
export const selectProducts = createSelector(
  [(state: RootState) => state.product.products],
  (products) => products ?? []
);

export const selectSimilarProducts = createSelector(
  [(state: RootState) => state.product.similarProducts],
  (products) => products ?? []
);

export const selectTopProducts = createSelector(
  [(state: RootState) => state.product.topProducts],
  (products) => products ?? []
);

export const selectProductLoading = (state: RootState) => state.product.loading;

export const selectProductError = (state: RootState) => state.product.error;

export const selectProductPagination = (state: RootState) =>
  state.product.pagination;
