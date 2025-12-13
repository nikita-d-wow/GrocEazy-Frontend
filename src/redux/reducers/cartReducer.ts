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
};

export function cartReducer(
  state = initialState,
  action: CartActionTypes
): CartState {
  switch (action.type) {
    case CART_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case CART_FETCH_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case CART_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CART_CLEAR:
      return { ...state, items: [] };

    default:
      return state;
  }
}
