import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAILURE,
  CART_CLEAR,
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
    try {
      if (quantity < 1) {
        return;
      }

      await api.put(`/api/cart/${cartId}`, { quantity });

      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };
};

/* ================= REMOVE ITEM ================= */
export const removeCartItem = (cartId: string) => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      await api.delete(`/api/cart/${cartId}`);

      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));

      toast.success('Item removed from cart');
    } catch (err: any) {
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

    try {
      await api.post('/api/cart', { productId, quantity });

      dispatch(fetchCart(cart.pagination.page, cart.pagination.limit));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    }
  };
};
