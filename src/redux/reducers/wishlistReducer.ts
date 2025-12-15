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
};

export function wishlistReducer(
  state = initialState,
  action: WishlistActionTypes
): WishlistState {
  switch (action.type) {
    case WISHLIST_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case WISHLIST_FETCH_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case WISHLIST_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
