export const CART_FETCH_REQUEST = 'CART_FETCH_REQUEST';
export const CART_FETCH_SUCCESS = 'CART_FETCH_SUCCESS';
export const CART_FETCH_FAILURE = 'CART_FETCH_FAILURE';

export const CART_CLEAR = 'CART_CLEAR';

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

export interface CartState {
  loading: boolean;
  items: CartItem[];
  error: string | null;
}

/* ======================
   CART ACTION TYPES
====================== */

export type CartActionTypes =
  | { type: typeof CART_FETCH_REQUEST }
  | { type: typeof CART_FETCH_SUCCESS; payload: CartItem[] }
  | { type: typeof CART_FETCH_FAILURE; payload: string }
  | { type: typeof CART_CLEAR };
