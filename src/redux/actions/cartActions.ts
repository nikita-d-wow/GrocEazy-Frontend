import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  CART_FETCH_REQUEST,
  CART_FETCH_SUCCESS,
  CART_FETCH_FAILURE,
  CART_CLEAR,
  CART_UPDATE_ITEM,
  CART_REMOVE_ITEM,
  CART_ADD_ITEM,
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
    // Optimistic update
    dispatch({
      type: CART_UPDATE_ITEM,
      payload: { cartId, quantity },
    });

    try {
      if (quantity < 1) {
        return;
      }

      await api.put(`/api/cart/${cartId}`, { quantity });

      // Background sync to ensure total price is correct etc
      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
      // Revert would be good here, for now just re-fetching
      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));
    }
  };
};

/* ================= REMOVE ITEM ================= */
export const removeCartItem = (cartId: string) => {
  return async (dispatch: AppDispatch, getState: any) => {
    // Optimistic remove
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: cartId,
    });

    try {
      await api.delete(`/api/cart/${cartId}`);

      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));

      toast.success('Item removed from cart');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
      // Revert if needed
      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));
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
interface OptimisticProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

export const addToCart = (
  productId: string,
  quantity = 1,
  product?: OptimisticProduct
) => {
  return async (dispatch: AppDispatch, getState: any) => {
    const { auth, cart } = getState();

    if (!auth.user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    // Optimistic Update
    if (product) {
      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          _id: `temp-${Date.now()}`, // Temporary ID
          productId: product._id,
          quantity,
          lineTotal: product.price * quantity,
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
      await api.post('/api/cart', { productId, quantity });

      dispatch(fetchCart(cart.pagination.page, cart.pagination.limit));
      if (!product) {
        toast.success('Added to cart');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
      // Revert if needed, but fetchCart usually fixes it
      dispatch(fetchCart(cart.pagination.page, cart.pagination.limit));
    }
  };
};
