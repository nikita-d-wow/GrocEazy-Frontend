import type { Product } from '../../types/Product';

/* ================= ADDRESS ================= */

export interface Address {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

/* ================= ORDER ITEM ================= */

export interface OrderItem {
  productId: Product | null; // can be null
  quantity: number;
  unitPrice: number;
}

/* ================= USER (POPULATED) ================= */

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

/* ================= ORDER ================= */

export interface Order {
  _id: string;
  userId: OrderUser | null;
  items: OrderItem[];
  address: Address;
  paymentMethod?: 'cod' | 'online';
  paymentStatus?: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

/* ================= PAGINATION ================= */

export interface OrderPagination {
  total: number;
  page: number;
  pages: number;
}

/* ================= STATE ================= */

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  pagination: OrderPagination | null;
  loading: boolean;
  error: string | null;
}

/* ================= ACTION TYPES ================= */

export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';

export const FETCH_ORDER_DETAILS_REQUEST = 'FETCH_ORDER_DETAILS_REQUEST';
export const FETCH_ORDER_DETAILS_SUCCESS = 'FETCH_ORDER_DETAILS_SUCCESS';
export const FETCH_ORDER_DETAILS_FAILURE = 'FETCH_ORDER_DETAILS_FAILURE';

export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';

export const CANCEL_ORDER_REQUEST = 'CANCEL_ORDER_REQUEST';
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILURE = 'CANCEL_ORDER_FAILURE';

/* ================= ACTION INTERFACES ================= */

interface FetchOrdersRequestAction {
  type: typeof FETCH_ORDERS_REQUEST;
}

interface FetchOrdersSuccessAction {
  type: typeof FETCH_ORDERS_SUCCESS;
  payload: {
    orders: Order[];
    pagination: OrderPagination | null;
  };
}

interface FetchOrdersFailureAction {
  type: typeof FETCH_ORDERS_FAILURE;
  payload: string;
}

interface FetchOrderDetailsRequestAction {
  type: typeof FETCH_ORDER_DETAILS_REQUEST;
}

interface FetchOrderDetailsSuccessAction {
  type: typeof FETCH_ORDER_DETAILS_SUCCESS;
  payload: Order;
}

interface FetchOrderDetailsFailureAction {
  type: typeof FETCH_ORDER_DETAILS_FAILURE;
  payload: string;
}

interface CreateOrderRequestAction {
  type: typeof CREATE_ORDER_REQUEST;
}

interface CreateOrderSuccessAction {
  type: typeof CREATE_ORDER_SUCCESS;
  payload: Order;
}

interface CreateOrderFailureAction {
  type: typeof CREATE_ORDER_FAILURE;
  payload: string;
}

interface CancelOrderRequestAction {
  type: typeof CANCEL_ORDER_REQUEST;
}

interface CancelOrderSuccessAction {
  type: typeof CANCEL_ORDER_SUCCESS;
  payload: string; // order id
}

interface CancelOrderFailureAction {
  type: typeof CANCEL_ORDER_FAILURE;
  payload: string;
}

/* ================= UNION ================= */

export type OrderActionTypes =
  | FetchOrdersRequestAction
  | FetchOrdersSuccessAction
  | FetchOrdersFailureAction
  | FetchOrderDetailsRequestAction
  | FetchOrderDetailsSuccessAction
  | FetchOrderDetailsFailureAction
  | CreateOrderRequestAction
  | CreateOrderSuccessAction
  | CreateOrderFailureAction
  | CancelOrderRequestAction
  | CancelOrderSuccessAction
  | CancelOrderFailureAction;
