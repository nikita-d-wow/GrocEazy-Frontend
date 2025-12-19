import type { RootState } from '../store';

/* ======================
   BASIC SELECTORS
====================== */

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartLoading = (state: RootState) => state.cart.loading;

export const selectCartError = (state: RootState) => state.cart.error;

/* ======================
   PAGINATION SELECTOR
====================== */

export const selectCartPagination = (state: RootState) => state.cart.pagination;

/* ======================
   TOTAL (CURRENT PAGE)
====================== */

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );
