import api from '../../services/api';
import type { AppDispatch } from '../store';
import type { RootState } from '../rootReducer';
import {
  WISHLIST_FETCH_REQUEST,
  WISHLIST_FETCH_SUCCESS,
  WISHLIST_FETCH_FAILURE,
  WISHLIST_REMOVE_ITEM,
  WISHLIST_ADD_ITEM,
  WISHLIST_ADD_ITEM_SUCCESS,
  type WishlistProduct,
} from '../types/wishlistTypes';

const DEFAULT_LIMIT = 12;
import { CART_ADD_ITEM } from '../types/cartTypes';

export const fetchWishlist =
  (page = 1, limit = DEFAULT_LIMIT, isSilent = false) =>
  async (dispatch: AppDispatch) => {
    if (!isSilent) {
      dispatch({ type: WISHLIST_FETCH_REQUEST });
    }
    try {
      const { data } = await api.get(`/wishlist?page=${page}&limit=${limit}`);

      dispatch({
        type: WISHLIST_FETCH_SUCCESS,
        payload: {
          items: data.items,
          pagination: data.pagination,
        },
      });
    } catch {
      dispatch({
        type: WISHLIST_FETCH_FAILURE,
        payload: 'Failed to load wishlist',
      });
    }
  };

export const removeWishlistItem =
  (wishlistId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    // Optimistic Update: Remove local item immediately
    dispatch({
      type: WISHLIST_REMOVE_ITEM,
      payload: wishlistId,
    });

    try {
      await api.delete(`/wishlist/${wishlistId}`);

      // Background re-fetch to sync pagination / data
      const { page, limit } = getState().wishlist.pagination;
      dispatch(fetchWishlist(page, limit, true));
    } catch {
      // Revert if it fails
      const { page, limit } = getState().wishlist.pagination;
      dispatch(fetchWishlist(page, limit, true));
    }
  };

interface OptimisticProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  description: string;
}

export const moveWishlistToCart =
  (wishlistId: string, product?: OptimisticProduct) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    // Optimistic Update
    if (product) {
      dispatch({
        type: WISHLIST_REMOVE_ITEM,
        payload: wishlistId,
      });

      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          _id: `temp-${Date.now()}`,
          productId: product._id,
          quantity: 1,
          lineTotal: product.price,
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
            stock: product.stock,
          },
        },
      });
    }

    try {
      await api.post(`/wishlist/${wishlistId}/move-to-cart`);

      const { page, limit } = getState().wishlist.pagination;
      dispatch(fetchWishlist(page, limit, true));

      // Sync cart too
      // dispatch(fetchCart(...)) handled by component or parallel action if needed
    } catch {
      // Revert if needed
      const { page, limit } = getState().wishlist.pagination;
      dispatch(fetchWishlist(page, limit, true));
    }
  };

export const addToWishlist =
  (productId: string, product?: OptimisticProduct) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const tempId = `temp-${Date.now()}`;
    // Optimistic Add
    if (product) {
      dispatch({
        type: WISHLIST_ADD_ITEM,
        payload: {
          _id: tempId,
          productId,
          product: product as WishlistProduct,
        },
      });
    }

    try {
      const { data } = await api.post('/wishlist', { productId });

      if (data.success && data.item) {
        dispatch({
          type: WISHLIST_ADD_ITEM_SUCCESS,
          payload: {
            tempId,
            item: data.item,
          },
        });
      }

      const { page, limit } = getState().wishlist.pagination;
      dispatch(fetchWishlist(page, limit, true));
    } catch {
      // Revert
      const { page, limit } = getState().wishlist.pagination;
      dispatch(fetchWishlist(page, limit, true));
    }
  };
