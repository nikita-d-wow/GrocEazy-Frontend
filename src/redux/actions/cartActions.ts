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
    await api.put(`/api/cart/${cartId}`, { quantity });
    dispatch(fetchCart());
  };
};

export const removeCartItem = (cartId: string) => {
  return async (dispatch: AppDispatch) => {
    await api.delete(`/api/cart/${cartId}`);
    dispatch(fetchCart());
  };
};

export const clearCart = () => {
  return async (dispatch: AppDispatch) => {
    await api.delete('/api/cart');
    dispatch({ type: CART_CLEAR });
  };
};
