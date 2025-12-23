import {
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAILURE,
  CART_CLEAR,
  CART_ITEM_UPDATE_QTY,
  CART_ITEM_REMOVE,
  CART_ITEM_ADD,
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
    case CART_ITEM_UPDATE_QTY:
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload.cartId
            ? {
                ...item,
                quantity: action.payload.quantity,
                lineTotal: item.product.price * action.payload.quantity,
              }
            : item
        ),
      };

    case CART_ITEM_REMOVE:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload.cartId),
      };

    case CART_ITEM_ADD:
      return {
        ...state,
        items: [...state.items, action.payload.item],
      };

    default:
      return state;
  }
}
