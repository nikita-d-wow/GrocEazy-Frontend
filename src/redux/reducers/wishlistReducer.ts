import {
  WISHLIST_FETCH_REQUEST,
  WISHLIST_FETCH_SUCCESS,
  WISHLIST_FETCH_FAILURE,
} from '../types/wishlistTypes';

import type {
  WishlistState,
  WishlistActionTypes,
} from '../types/wishlistTypes';

const initialState: WishlistState = {
  loading: false,
  items: [],
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
};

export function wishlistReducer(
  state = initialState,
  action: WishlistActionTypes
): WishlistState {
  switch (action.type) {
    case WISHLIST_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case WISHLIST_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        pagination: action.payload.pagination,
      };

    case WISHLIST_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
