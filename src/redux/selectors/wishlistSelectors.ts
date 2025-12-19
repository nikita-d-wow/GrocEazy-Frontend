import type { RootState } from '../store';

export const selectWishlistItems = (state: RootState) => state.wishlist.items;

export const selectWishlistLoading = (state: RootState) =>
  state.wishlist.loading;

export const selectWishlistError = (state: RootState) => state.wishlist.error;

export const selectWishlistPagination = (state: RootState) =>
  state.wishlist.pagination;
