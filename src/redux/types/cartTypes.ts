export const CART_FETCH_REQUEST = 'CART_FETCH_REQUEST';
export const CART_FETCH_SUCCESS = 'CART_FETCH_SUCCESS';
export const CART_FETCH_FAILURE = 'CART_FETCH_FAILURE';

export const CART_CLEAR = 'CART_CLEAR';
export const CART_UPDATE_ITEM = 'CART_UPDATE_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_ADD_ITEM_SUCCESS = 'CART_ADD_ITEM_SUCCESS';

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
  itemMap: Record<string, CartItem>; // productId -> CartItem
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
      type: typeof CART_UPDATE_ITEM;
      payload: { cartId: string; quantity: number };
    }
  | { type: typeof CART_REMOVE_ITEM; payload: string }
  | { type: typeof CART_ADD_ITEM; payload: CartItem }
  | {
      type: typeof CART_ADD_ITEM_SUCCESS;
      payload: { tempId: string; item: CartItem };
    };
