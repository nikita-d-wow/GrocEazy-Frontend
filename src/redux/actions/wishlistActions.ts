import api from '../../services/api';
import type { AppDispatch } from '../store';
import {
  WISHLIST_FETCH_REQUEST,
  WISHLIST_FETCH_SUCCESS,
  WISHLIST_FETCH_FAILURE,
} from '../types/wishlistTypes';

export const fetchWishlist = () => async (dispatch: AppDispatch) => {
  dispatch({ type: WISHLIST_FETCH_REQUEST });
  try {
    const { data } = await api.get('/api/wishlist');
    dispatch({
      type: WISHLIST_FETCH_SUCCESS,
      payload: data.wishlist,
    });
  } catch {
    dispatch({
      type: WISHLIST_FETCH_FAILURE,
      payload: 'Failed to load wishlist',
    });
  }
};

export const removeWishlistItem =
  (wishlistId: string) => async (dispatch: AppDispatch) => {
    await api.delete(`/api/wishlist/${wishlistId}`);
    dispatch(fetchWishlist());
  };

export const moveWishlistToCart =
  (wishlistId: string) => async (dispatch: AppDispatch) => {
    await api.post(`/api/wishlist/${wishlistId}/move-to-cart`);
    dispatch(fetchWishlist());
  };

export const addToWishlist =
  (productId: string) => async (dispatch: AppDispatch) => {
    await api.post('/api/wishlist', { productId });
    dispatch(fetchWishlist());
  };
