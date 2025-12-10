import type { RootState } from '../store';

export const selectProducts = (state: RootState) => state.product.products;

export const selectProductLoading = (state: RootState) => state.product.loading;

export const selectProductError = (state: RootState) => state.product.error;
