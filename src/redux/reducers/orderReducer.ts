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
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  FETCH_ORDER_STATS_REQUEST,
  FETCH_ORDER_STATS_SUCCESS,
  FETCH_ORDER_STATS_FAILURE,
  type OrderState,
  type OrderActionTypes,
} from '../types/orderTypes';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  pagination: null,
  stats: null,
  loading: false,
  error: null,
};

export const orderReducer = (
  state = initialState,
  action: OrderActionTypes
): OrderState => {
  switch (action.type) {
    // ================= FETCH ORDERS =================
    case FETCH_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
        pagination: action.payload.pagination,
        stats: action.payload.stats || state.stats || null, // Keep existing stats if not provided (though getMyOrders might not provide it anymore if we separated it)
      };

    case FETCH_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ================= FETCH ORDER DETAILS =================
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

    // ================= CREATE ORDER =================
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

    // ================= CANCEL ORDER =================
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

    // ================= BACKGROUND STATUS UPDATE =================
    case UPDATE_ORDER_STATUS_REQUEST:
      return { ...state, error: null }; // Don't set global loading

    case UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order._id === action.payload._id) {
            // ✅ Safety check: If payload has userId as string (unpopulated), keep our existing populated object
            const preservedUser =
              typeof action.payload.userId === 'string'
                ? order.userId
                : action.payload.userId || order.userId;

            return { ...order, ...action.payload, userId: preservedUser };
          }
          return order;
        }),
        currentOrder:
          state.currentOrder?._id === action.payload._id
            ? {
                ...state.currentOrder,
                ...action.payload,
                userId:
                  typeof action.payload.userId === 'string'
                    ? state.currentOrder.userId
                    : action.payload.userId || state.currentOrder.userId,
              }
            : state.currentOrder,
      };

    case UPDATE_ORDER_STATUS_FAILURE:
      return { ...state, error: action.payload.error };

    // ================= ORDER STATS =================
    case FETCH_ORDER_STATS_REQUEST:
      return { ...state }; // No global loading for stats

    case FETCH_ORDER_STATS_SUCCESS:
      return {
        ...state,
        stats: action.payload,
      };

    case FETCH_ORDER_STATS_FAILURE:
      return { ...state }; // Silently fail stats

    default:
      return state;
  }
};
