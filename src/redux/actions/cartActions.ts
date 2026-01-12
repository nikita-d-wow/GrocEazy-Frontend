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
  CART_ADD_ITEM_SUCCESS,
  type CartProduct,
} from '../types/cartTypes';
import type { AppDispatch } from '../store';
import type { RootState } from '../rootReducer';

const DEFAULT_LIMIT = 5;

/* ================= FETCH CART (PAGINATED) ================= */
export const fetchCart =
  (page = 1, limit = DEFAULT_LIMIT) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: CART_FETCH_REQUEST });

    try {
      const { data } = await api.get(`/cart?page=${page}&limit=${limit}`);

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
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    // Optimistic update
    dispatch({
      type: CART_UPDATE_ITEM,
      payload: { cartId, quantity },
    });

    try {
      if (quantity < 1) {
        return;
      }

      await api.put(`/cart/${cartId}`, { quantity });

      // Background sync
      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));
    } catch (err: unknown) {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to update quantity');
      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));
    }
  };
};

/* ================= REMOVE ITEM ================= */
export const removeCartItem = (cartId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    // Optimistic remove
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: cartId,
    });

    try {
      await api.delete(`/cart/${cartId}`);

      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));

      toast.success('Item removed from cart');
    } catch (err: unknown) {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to remove item');
      const { page, limit } = getState().cart.pagination;
      dispatch(fetchCart(page, limit));
    }
  };
};

/* ================= CLEAR CART ================= */
export const clearCart = () => {
  return async (dispatch: AppDispatch) => {
    try {
      await api.delete('/cart');
      dispatch({ type: CART_CLEAR });
      toast.success('Cart cleared');
    } catch (err: unknown) {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to clear cart');
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
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { auth } = getState();

    if (!auth.user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    const tempId = `temp-${Date.now()}`;

    // Optimistic Update
    if (product) {
      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          _id: tempId,
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
      const { data } = await api.post('/cart', { productId, quantity });

      if (data.success && data.item) {
        dispatch({
          type: CART_ADD_ITEM_SUCCESS,
          payload: {
            tempId,
            item: {
              ...data.item,
              productId: data.item.productId._id || data.item.productId,
              product: data.item.productId as CartProduct,
            },
          },
        });
      }

      if (!product) {
        toast.success('Added to cart');
      }
    } catch (err: unknown) {
      const error = err as any;
      toast.error(
        error.response?.data?.message || 'Failed to add item to cart'
      );
      const { cart } = getState();
      dispatch(fetchCart(cart.pagination.page, cart.pagination.limit));
    }
  };
};
