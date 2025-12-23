export const WISHLIST_FETCH_REQUEST = 'WISHLIST_FETCH_REQUEST';
export const WISHLIST_FETCH_SUCCESS = 'WISHLIST_FETCH_SUCCESS';
export const WISHLIST_FETCH_FAILURE = 'WISHLIST_FETCH_FAILURE';
export const WISHLIST_REMOVE_ITEM = 'WISHLIST_REMOVE_ITEM';
export const WISHLIST_ADD_ITEM = 'WISHLIST_ADD_ITEM';

export const WISHLIST_REMOVE_REQUEST = 'WISHLIST_REMOVE_REQUEST';
export const WISHLIST_MOVE_TO_CART_REQUEST = 'WISHLIST_MOVE_TO_CART_REQUEST';

/* ======================
   PRODUCT TYPE
====================== */

export interface WishlistProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  size?: string;
  dietary?: string;
}

/* ======================
   WISHLIST ITEM
====================== */

export interface WishlistItem {
  _id: string;
  productId: string;
  product: WishlistProduct;
}

/* ======================
   PAGINATION TYPE
====================== */

export interface WishlistPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ======================
   STATE
====================== */

export interface WishlistState {
  loading: boolean;
  items: WishlistItem[];
  error: string | null;
  pagination: WishlistPagination;
}

/* ======================
   ACTION TYPES
====================== */

export type WishlistActionTypes =
  | { type: typeof WISHLIST_FETCH_REQUEST }
  | {
      type: typeof WISHLIST_FETCH_SUCCESS;
      payload: {
        items: WishlistItem[];
        pagination: WishlistPagination;
      };
    }
  | { type: typeof WISHLIST_FETCH_FAILURE; payload: string }
  | { type: typeof WISHLIST_REMOVE_ITEM; payload: string }
  | { type: typeof WISHLIST_ADD_ITEM; payload: WishlistItem };
