import toast from 'react-hot-toast';
import type { Dispatch } from 'redux';
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDER_DETAILS_REQUEST,
  FETCH_ORDER_DETAILS_SUCCESS,
  FETCH_ORDER_DETAILS_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  type OrderActionTypes,
  type Order,
  type Address,
} from '../types/orderTypes';

import api from '../../services/api';
import { clearCart } from './cartActions';

interface CreateOrderPayload {
  items: { productId: string; quantity: number; unitPrice: number }[];
  address: Address;
  paymentMethod: 'cod' | 'online';
}

/* ================= USER ORDERS ================= */

export const getMyOrders =
  (page = 1, limit = 5) =>
  async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });

    try {
      const { data } = await api.get(`/api/orders?page=${page}&limit=${limit}`);

      dispatch({
        type: FETCH_ORDERS_SUCCESS,
        payload: {
          orders: data.orders ?? data,
          pagination: data.pagination ?? null,
        },
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_ORDERS_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch orders',
      });
    }
  };

export const getOrderDetails =
  (id: string) => async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: FETCH_ORDER_DETAILS_REQUEST });

    try {
      const { data } = await api.get<Order>(`/api/orders/${id}`);
      dispatch({ type: FETCH_ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error: any) {
      dispatch({
        type: FETCH_ORDER_DETAILS_FAILURE,
        payload:
          error.response?.data?.message || 'Failed to fetch order details',
      });
    }
  };

/* ================= CREATE ORDER ================= */

export const createOrder =
  (payload: CreateOrderPayload, navigate: any) =>
  async (dispatch: Dispatch<any>) => {
    dispatch({ type: CREATE_ORDER_REQUEST });

    try {
      const { data } = await api.post<Order>('/api/orders', payload);

      dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });

      // ✅ clear frontend cart ONLY after successful order
      dispatch(clearCart());

      toast.success('Order placed successfully!');
      navigate('/');
    } catch (error: any) {
      dispatch({
        type: CREATE_ORDER_FAILURE,
        payload: error.response?.data?.message || 'Failed to create order',
      });

      toast.error(error.response?.data?.message || 'Order failed, try again');
    }
  };

/* ================= CANCEL ORDER ================= */

export const cancelOrder =
  (id: string) => async (dispatch: Dispatch<OrderActionTypes>) => {
    // Optimistic Update
    dispatch({ type: CANCEL_ORDER_SUCCESS, payload: id });

    try {
      await api.patch(`/api/orders/${id}/cancel`);
      // Success already dispatched. Maybe toast?
      toast.success('Order cancelled');
    } catch (error: any) {
      // Revert needs a reload
      dispatch({
        type: CANCEL_ORDER_FAILURE,
        payload: error.response?.data?.message || 'Failed to cancel order',
      });
      // Force reload to get back original status
      dispatch(getAllOrders() as any);
      // Note: for user side it might be getMyOrders(), but usually component handles fetch.
    }
  };

/* ================= MANAGER ORDERS ================= */

export const getAllOrders =
  (page = 1, limit = 5) =>
  async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });

    try {
      const { data } = await api.get(
        `/api/orders/all?page=${page}&limit=${limit}`
      );

      dispatch({
        type: FETCH_ORDERS_SUCCESS,
        payload: {
          orders: data.orders,
          pagination: data.pagination,
        },
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_ORDERS_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch orders',
      });
    }
  };

export const changeOrderStatus =
  (id: string, status: string) =>
  async (dispatch: Dispatch<OrderActionTypes>) => {
    // Optimistic Update
    dispatch({
      type: UPDATE_ORDER_STATUS_SUCCESS,
      payload: { _id: id, status } as any, // Partial update
    });

    try {
      const { data } = await api.patch(`/api/orders/${id}/status`, { status });
      // Final confirmation from server
      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: data.order,
      });
    } catch (error: any) {
      // Revert/Error will be tricky without old status, but typical error handling:
      dispatch({
        type: UPDATE_ORDER_STATUS_FAILURE,
        payload: {
          id,
          error:
            error.response?.data?.message || 'Failed to update order status',
        },
      });
      // Force refresh to ensure valid state
      dispatch(getAllOrders() as any);
    }
  };
