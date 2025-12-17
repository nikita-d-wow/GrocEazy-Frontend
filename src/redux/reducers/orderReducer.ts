import {
  type OrderState,
  type OrderActionTypes,
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
} from '../types/orderTypes';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const orderReducer = (
  state = initialState,
  action: OrderActionTypes
): OrderState => {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload };

    case FETCH_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_ORDER_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentOrder: action.payload,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };

    case FETCH_ORDER_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_ORDER_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
      };

    case CREATE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CANCEL_ORDER_REQUEST:
      return { ...state, loading: true, error: null };

    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: state.orders.map((order) =>
          order._id === action.payload
            ? { ...order, status: 'Cancelled' }
            : order
        ),
        currentOrder:
          state.currentOrder && state.currentOrder._id === action.payload
            ? { ...state.currentOrder, status: 'Cancelled' }
            : state.currentOrder,
      };

    case CANCEL_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
