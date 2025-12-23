import {
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAILURE,
  CART_CLEAR,
  CART_UPDATE_ITEM,
  CART_REMOVE_ITEM,
  CART_ADD_ITEM,
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

    case CART_UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload.cartId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case CART_REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };

    case CART_ADD_ITEM: {
      // Check if item already exists (safety check)
      const existingItem = state.items.find(
        (item) => item.product._id === action.payload.product._id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === action.payload.product._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
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
