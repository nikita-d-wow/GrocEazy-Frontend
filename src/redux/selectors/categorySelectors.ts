import type { RootState } from '../store';

export const selectCategories = (state: RootState) => state.category.categories;

export const selectCategoryLoading = (state: RootState) =>
  state.category.loading;
