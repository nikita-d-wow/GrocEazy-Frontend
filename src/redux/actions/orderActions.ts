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
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
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

export const getMyOrders = () => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    try {
      const { data } = await api.get<Order[]>('/api/orders');
      dispatch({ type: FETCH_ORDERS_SUCCESS, payload: data });
    } catch (error: any) {
      dispatch({
        type: FETCH_ORDERS_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch orders',
      });
    }
  };
};

export const getOrderDetails = (id: string) => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
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
};

export const createOrder = (payload: CreateOrderPayload, navigate: any) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch({ type: CREATE_ORDER_REQUEST });

    try {
      const token = localStorage.getItem('accessToken');

      const { data } = await api.post<Order>('/api/orders', payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
      dispatch(clearCart());
      navigate('/orders');
    } catch (error: any) {
      dispatch({
        type: CREATE_ORDER_FAILURE,
        payload: error.response?.data?.message || 'Failed to create order',
      });
    }
  };
};

export const cancelOrder = (id: string) => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: CANCEL_ORDER_REQUEST });
    try {
      await api.patch(`/api/orders/${id}/cancel`);
      dispatch({ type: CANCEL_ORDER_SUCCESS, payload: id });
    } catch (error: any) {
      dispatch({
        type: CANCEL_ORDER_FAILURE,
        payload: error.response?.data?.message || 'Failed to cancel order',
      });
    }
  };
};

/* ================= MANAGER ACTIONS ================= */

export const getAllOrders = (page = 1, limit = 5) => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    try {
      const { data } = await api.get(
        `/api/orders/all?page=${page}&limit=${limit}`
      );
      dispatch({
        type: FETCH_ORDERS_SUCCESS,
        payload: data.orders,
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_ORDERS_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch orders',
      });
    }
  };
};

export const changeOrderStatus = (id: string, status: string) => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: FETCH_ORDER_DETAILS_REQUEST });
    try {
      const { data } = await api.patch(`/api/orders/${id}/status`, { status });
      dispatch({
        type: FETCH_ORDER_DETAILS_SUCCESS,
        payload: data.order,
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_ORDER_DETAILS_FAILURE,
        payload:
          error.response?.data?.message || 'Failed to update order status',
      });
    }
  };
};
