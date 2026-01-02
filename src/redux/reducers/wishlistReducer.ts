import {
  WISHLIST_FETCH_REQUEST,
  WISHLIST_FETCH_SUCCESS,
  WISHLIST_FETCH_FAILURE,
  WISHLIST_REMOVE_ITEM,
  WISHLIST_ADD_ITEM,
  WISHLIST_ADD_ITEM_SUCCESS,
} from '../types/wishlistTypes';

import type {
  WishlistState,
  WishlistActionTypes,
} from '../types/wishlistTypes';

const initialState: WishlistState = {
  loading: false,
  items: [],
  idMap: {},
  error: null,
  pagination: {
    page: 1,
    limit: 12,
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

export function wishlistReducer(
  state = initialState,
  action: WishlistActionTypes
): WishlistState {
  switch (action.type) {
    case WISHLIST_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case WISHLIST_FETCH_SUCCESS: {
      const newIdMap = { ...state.idMap };
      action.payload.items.forEach((item) => {
        const prodId = getProductId(item);
        if (prodId) {
          newIdMap[prodId] = item._id;
        }
      });

      return {
        ...state,
        loading: false,
        items: action.payload.items,
        idMap: newIdMap,
        pagination: action.payload.pagination,
      };
    }

    case WISHLIST_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case WISHLIST_REMOVE_ITEM: {
      const wishlistId = action.payload;
      const newIdMap = { ...state.idMap };
      Object.keys(newIdMap).forEach((prodId) => {
        if (newIdMap[prodId] === wishlistId) {
          delete newIdMap[prodId];
        }
      });

      return {
        ...state,
        items: state.items.filter((item) => item._id !== wishlistId),
        idMap: newIdMap,
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };
    }

    case WISHLIST_ADD_ITEM: {
      const prodId = getProductId(action.payload);
      if (!prodId || state.idMap[prodId]) {
        return state;
      }

      return {
        ...state,
        items: [action.payload, ...state.items],
        idMap: {
          ...state.idMap,
          [prodId]: action.payload._id,
        },
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };
    }

    case WISHLIST_ADD_ITEM_SUCCESS: {
      const { tempId, item } = action.payload;
      const prodId = getProductId(item);

      return {
        ...state,
        items: state.items.map((i) => (i._id === tempId ? item : i)),
        idMap: {
          ...state.idMap,
          [prodId]: item._id,
        },
      };
    }

    default:
      return state;
  }
}
