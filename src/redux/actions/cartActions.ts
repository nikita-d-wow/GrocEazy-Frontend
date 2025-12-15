import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAILURE,
  CART_CLEAR,
} from '../types/cartTypes';
import type { AppDispatch } from '../store';

export const fetchCart = () => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: CART_FETCH_REQUEST });

    try {
      const { data } = await api.get('/api/cart');

      dispatch({
        type: CART_FETCH_SUCCESS,
        payload: data.cart,
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
};

export const updateCartQty = (cartId: string, quantity: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      if (quantity < 0) {
        return;
      } // Prevent negative quantity
      await api.put(`/api/cart/${cartId}`, { quantity });
      dispatch(fetchCart());
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };
};

export const removeCartItem = (cartId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      await api.delete(`/api/cart/${cartId}`);
      dispatch(fetchCart());
      toast.success('Item removed from cart');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };
};

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

export const addToCart = (productId: string, quantity = 1) => {
  return async (dispatch: AppDispatch) => {
    try {
      await api.post('/api/cart', {
        productId,
        quantity,
      });

      dispatch(fetchCart());
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    }
  };
};
