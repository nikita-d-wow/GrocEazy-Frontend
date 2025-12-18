import type { Product } from '../../types/Product';

export interface Address {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface OrderItem {
  product: Product; // Populated product
  quantity: number;
  unitPrice: number;
}

export interface Order {
  _id: string;
  user: string; // User ID
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'cod' | 'online';
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

// Action Types
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

interface FetchOrdersRequestAction {
  type: typeof FETCH_ORDERS_REQUEST;
}
interface FetchOrdersSuccessAction {
  type: typeof FETCH_ORDERS_SUCCESS;
  payload: Order[];
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
  payload: Order; // Return the created order
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
  payload: string; // Order ID
}
interface CancelOrderFailureAction {
  type: typeof CANCEL_ORDER_FAILURE;
  payload: string;
}

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
