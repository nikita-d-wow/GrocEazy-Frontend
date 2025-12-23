import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAILURE,
  CART_CLEAR,
  CART_ITEM_UPDATE_QTY,
  CART_ITEM_REMOVE,
  CART_ITEM_ADD,
} from '../types/cartTypes';

import type { AppDispatch } from '../store';

const DEFAULT_LIMIT = 5;

/* ================= FETCH CART (PAGINATED) ================= */
export const fetchCart =
  (page = 1, limit = DEFAULT_LIMIT) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: CART_FETCH_REQUEST });

    try {
      const { data } = await api.get(`/api/cart?page=${page}&limit=${limit}`);

      dispatch({
        type: CART_FETCH_SUCCESS,
        payload: {
          items: data.items,
          pagination: data.pagination,
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch cart';

      dispatch({
        type: CART_FETCH_FAILURE,
        payload: message,
      });
    }
  };

/* ================= UPDATE QUANTITY ================= */
export const updateCartQty = (cartId: string, quantity: number) => {
  return async (dispatch: AppDispatch, getState: any) => {
    // Optimistic Update
    const prevItems = getState().cart.items;
    dispatch({ type: CART_ITEM_UPDATE_QTY, payload: { cartId, quantity } });

    try {
      if (quantity < 1) {
        return;
      }

      await api.put(`/api/cart/${cartId}`, { quantity });

      // No need to full fetch if we're confident, but let's do it in background
      // to sync final totals/calculates from server if any.
      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));
    } catch (err: any) {
      // Rollback
      dispatch({
        type: CART_FETCH_SUCCESS,
        payload: {
          items: prevItems,
          pagination: getState().cart.pagination,
        },
      });
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };
};

/* ================= REMOVE ITEM ================= */
export const removeCartItem = (cartId: string) => {
  return async (dispatch: AppDispatch, getState: any) => {
    // Optimistic Update
    const prevItems = getState().cart.items;
    dispatch({ type: CART_ITEM_REMOVE, payload: { cartId } });

    try {
      await api.delete(`/api/cart/${cartId}`);

      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));

      toast.success('Item removed from cart');
    } catch (err: any) {
      // Rollback
      dispatch({
        type: CART_FETCH_SUCCESS,
        payload: {
          items: prevItems,
          pagination: getState().cart.pagination,
        },
      });
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };
};

/* ================= CLEAR CART ================= */
export const clearCart = () => {
  return async (dispatch: AppDispatch) => {
    try {
      await api.delete('/api/cart');
      dispatch({ type: CART_CLEAR });
      toast.success('Cart cleared');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to clear cart');
    }
  };
};

/* ================= ADD TO CART ================= */
export const addToCart = (productId: string, quantity = 1) => {
  return async (dispatch: AppDispatch, getState: any) => {
    const { auth, cart } = getState();

    if (!auth.user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    // Note: Adding is harder to do fully optimistically because we don't have the cartId yet
    // However, we can show a loading state or a "ghost" item.
    // For now, let's keep it simple but avoid the delay if possible.

    try {
      await api.post('/api/cart', { productId, quantity });
      toast.success('Added to cart');

      dispatch(fetchCart(cart.pagination.page, cart.pagination.limit));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    }
  };
};
