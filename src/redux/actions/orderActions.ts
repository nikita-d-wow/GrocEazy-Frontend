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
  type OrderItem,
  type Address,
} from '../types/orderTypes';
import api from '../../services/api';

// Create Order Payload
interface CreateOrderPayload {
  items: { productId: string; quantity: number; unitPrice: number }[];
  shippingAddress: Address;
  paymentMethod: 'cod' | 'online';
}

// Thunk Actions

// Get My Orders
export const getMyOrders = () => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
    try {
      const { data } = await api.get<Order[]>('/api/orders');
      dispatch({ type: FETCH_ORDERS_SUCCESS, payload: data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch orders';
      dispatch({ type: FETCH_ORDERS_FAILURE, payload: errorMessage });
    }
  };
};

// Get Order Details
export const getOrderDetails = (id: string) => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: FETCH_ORDER_DETAILS_REQUEST });
    try {
      const { data } = await api.get<Order>(`/api/orders/${id}`);
      dispatch({ type: FETCH_ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch order details';
      dispatch({ type: FETCH_ORDER_DETAILS_FAILURE, payload: errorMessage });
    }
  };
};

// Create Order
export const createOrder = (payload: CreateOrderPayload, navigate: any) => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    try {
      const { data } = await api.post<Order>('/api/orders', payload);
      dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });

      // Navigate to order success or specific order page
      // Ideally returned Order ID should be used
      navigate(`/orders/${data._id}`); // Assuming data._id exists on created order

      // We might want to clear cart here, but that should be handled by cart actions
      // or verified in component. For now just focus on order creation.
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create order';
      dispatch({ type: CREATE_ORDER_FAILURE, payload: errorMessage });
    }
  };
};

// Cancel Order
export const cancelOrder = (id: string) => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    dispatch({ type: CANCEL_ORDER_REQUEST });
    try {
      await api.patch(`/api/orders/${id}/cancel`);
      dispatch({ type: CANCEL_ORDER_SUCCESS, payload: id });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to cancel order';
      dispatch({ type: CANCEL_ORDER_FAILURE, payload: errorMessage });
    }
  };
};
