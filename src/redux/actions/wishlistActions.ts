import api from '../../services/api';
import type { AppDispatch } from '../store';
import {
  WISHLIST_FETCH_REQUEST,
  WISHLIST_FETCH_SUCCESS,
  WISHLIST_FETCH_FAILURE,
} from '../types/wishlistTypes';
import type { WishlistItem } from '../types/wishlistTypes';

const DEFAULT_LIMIT = 12;

export const fetchWishlist =
  (page = 1, limit = DEFAULT_LIMIT, isSilent = false) =>
  async (dispatch: AppDispatch) => {
    if (!isSilent) {
      dispatch({ type: WISHLIST_FETCH_REQUEST });
    }
    try {
      const { data } = await api.get(
        `/api/wishlist?page=${page}&limit=${limit}`
      );

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
  (wishlistId: string) => async (dispatch: AppDispatch, getState: any) => {
    // Optimistic Update
    const prevItems = getState().wishlist.items;
    const prevPagination = getState().wishlist.pagination;

    dispatch({
      type: WISHLIST_FETCH_SUCCESS,
      payload: {
        items: prevItems.filter(
          (item: WishlistItem) => item._id !== wishlistId
        ),
        pagination: prevPagination,
      },
    });

    try {
      await api.delete(`/api/wishlist/${wishlistId}`);
      // Background sync
      const { page, limit } = getState().wishlist.pagination;
      dispatch(fetchWishlist(page, limit, true));
    } catch {
      // Rollback
      dispatch({
        type: WISHLIST_FETCH_SUCCESS,
        payload: {
          items: prevItems,
          pagination: prevPagination,
        },
      });
    }
  };

export const moveWishlistToCart =
  (wishlistId: string) => async (dispatch: AppDispatch, getState: any) => {
    await api.post(`/api/wishlist/${wishlistId}/move-to-cart`);
    const { page, limit } = getState().wishlist.pagination;
    dispatch(fetchWishlist(page, limit, true));
  };

export const addToWishlist =
  (productId: string) => async (dispatch: AppDispatch, getState: any) => {
    await api.post('/api/wishlist', { productId });
    const { page, limit } = getState().wishlist.pagination;
    dispatch(fetchWishlist(page, limit, true));
  };
