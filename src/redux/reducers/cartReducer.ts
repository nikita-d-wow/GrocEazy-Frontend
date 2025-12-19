import {
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAILURE,
  CART_CLEAR,
} from '../types/cartTypes';

import type { CartState, CartActionTypes } from '../types/cartTypes';

const initialState: CartState = {
  loading: false,
  items: [],
  error: null,
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  },
};

export function cartReducer(
  state = initialState,
  action: CartActionTypes
): CartState {
  switch (action.type) {
    case CART_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case CART_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        pagination: action.payload.pagination,
      };

    case CART_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CART_CLEAR:
      return {
        ...state,
        items: [],
        pagination: { ...initialState.pagination },
      };

    default:
      return state;
  }
}
