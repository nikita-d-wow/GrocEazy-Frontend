import type { RootState } from '../store';

export const selectWishlistItems = (state: RootState) => state.wishlist.items;

export const selectWishlistLoading = (state: RootState) =>
  state.wishlist.loading;
