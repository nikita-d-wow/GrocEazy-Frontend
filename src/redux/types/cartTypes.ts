export const CART_FETCH_REQUEST = 'CART_FETCH_REQUEST';
export const CART_FETCH_SUCCESS = 'CART_FETCH_SUCCESS';
export const CART_FETCH_FAILURE = 'CART_FETCH_FAILURE';

export const CART_CLEAR = 'CART_CLEAR';
export const CART_ITEM_UPDATE_QTY = 'CART_ITEM_UPDATE_QTY';
export const CART_ITEM_REMOVE = 'CART_ITEM_REMOVE';
export const CART_ITEM_ADD = 'CART_ITEM_ADD';

/* ======================
   CART DATA TYPES
====================== */

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

export interface CartItem {
  _id: string; // cartId
  productId: string;
  quantity: number;
  lineTotal: number;
  product: CartProduct;
}

/* ======================
   PAGINATION TYPE
====================== */

export interface CartPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ======================
   CART STATE
====================== */

export interface CartState {
  loading: boolean;
  items: CartItem[];
  error: string | null;
  pagination: CartPagination;
}

/* ======================
   CART ACTION TYPES
====================== */

export type CartActionTypes =
  | { type: typeof CART_FETCH_REQUEST }
  | {
      type: typeof CART_FETCH_SUCCESS;
      payload: {
        items: CartItem[];
        pagination: CartPagination;
      };
    }
  | { type: typeof CART_FETCH_FAILURE; payload: string }
  | { type: typeof CART_CLEAR }
  | {
      type: typeof CART_ITEM_UPDATE_QTY;
      payload: { cartId: string; quantity: number };
    }
  | { type: typeof CART_ITEM_REMOVE; payload: { cartId: string } }
  | { type: typeof CART_ITEM_ADD; payload: { item: CartItem } };
