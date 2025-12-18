import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Memoized selector to prevent unnecessary re-renders
export const selectCategories = createSelector(
  [(state: RootState) => state.category?.categories],
  (categories) => categories ?? []
);

export const selectCategoryLoading = (state: RootState) =>
  state.category.loading;
