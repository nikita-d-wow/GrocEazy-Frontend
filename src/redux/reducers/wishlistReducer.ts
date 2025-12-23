import {
  WISHLIST_FETCH_REQUEST,
  WISHLIST_FETCH_SUCCESS,
  WISHLIST_FETCH_FAILURE,
  WISHLIST_REMOVE_ITEM,
  WISHLIST_ADD_ITEM,
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

    case WISHLIST_REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };

    case WISHLIST_ADD_ITEM: {
      const exists = state.items.find(
        (i) => i.productId === action.payload.productId
      );

      if (exists) {
        return state;
      }

      return {
        ...state,
        items: [action.payload, ...state.items],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };
    }

    default:
      return state;
  }
}
