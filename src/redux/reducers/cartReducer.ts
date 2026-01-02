import {
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAILURE,
  CART_CLEAR,
  CART_UPDATE_ITEM,
  CART_REMOVE_ITEM,
  CART_ADD_ITEM,
  CART_ADD_ITEM_SUCCESS,
} from '../types/cartTypes';

import type { CartState, CartActionTypes } from '../types/cartTypes';

const initialState: CartState = {
  loading: false,
  items: [],
  itemMap: {},
  error: null,
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  },
};

const getProductId = (item: {
  productId?: string | { _id?: string };
  product?: string | { _id?: string };
}): string => {
  const prod = item.productId || item.product;
  if (!prod) {
    return '';
  }
  if (typeof prod === 'string') {
    return prod;
  }
  if (typeof prod === 'object') {
    return String(prod._id || prod);
  }
  return String(prod);
};

export function cartReducer(
  state = initialState,
  action: CartActionTypes
): CartState {
  switch (action.type) {
    case CART_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case CART_FETCH_SUCCESS: {
      const newItemMap = { ...state.itemMap };
      action.payload.items.forEach((item) => {
        const prodId = getProductId(item);
        if (prodId) {
          newItemMap[prodId] = item;
        }
      });

      return {
        ...state,
        loading: false,
        items: action.payload.items,
        itemMap: newItemMap,
        pagination: action.payload.pagination,
      };
    }

    case CART_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CART_CLEAR:
      return {
        ...state,
        items: [],
        itemMap: {},
        pagination: { ...initialState.pagination },
      };

    case CART_UPDATE_ITEM: {
      const { cartId, quantity } = action.payload;
      const updatedItems = state.items.map((item) =>
        item._id === cartId ? { ...item, quantity } : item
      );

      const newItemMap = { ...state.itemMap };
      Object.keys(newItemMap).forEach((prodId) => {
        if (newItemMap[prodId]._id === cartId) {
          newItemMap[prodId] = { ...newItemMap[prodId], quantity };
        }
      });

      return {
        ...state,
        items: updatedItems,
        itemMap: newItemMap,
      };
    }

    case CART_REMOVE_ITEM: {
      const cartId = action.payload;
      const newItemMap = { ...state.itemMap };
      Object.keys(newItemMap).forEach((prodId) => {
        if (newItemMap[prodId]._id === cartId) {
          delete newItemMap[prodId];
        }
      });

      return {
        ...state,
        items: state.items.filter((item) => item._id !== cartId),
        itemMap: newItemMap,
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };
    }

    case CART_ADD_ITEM: {
      const targetProductId = getProductId(action.payload);
      if (!targetProductId) {
        return state;
      }

      const existingItem = state.itemMap[targetProductId];

      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + action.payload.quantity,
        };
        const updatedItems = state.items.map((item) =>
          getProductId(item) === targetProductId ? updatedItem : item
        );

        return {
          ...state,
          items: updatedItems,
          itemMap: {
            ...state.itemMap,
            [targetProductId]: updatedItem,
          },
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        itemMap: {
          ...state.itemMap,
          [targetProductId]: action.payload,
        },
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };
    }

    case CART_ADD_ITEM_SUCCESS: {
      const { tempId, item } = action.payload;
      const prodId = getProductId(item);

      return {
        ...state,
        items: state.items.map((i) => (i._id === tempId ? item : i)),
        itemMap: {
          ...state.itemMap,
          [prodId]: item,
        },
      };
    }

    default:
      return state;
  }
}
