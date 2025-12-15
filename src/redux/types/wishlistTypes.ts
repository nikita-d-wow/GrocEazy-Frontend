export const WISHLIST_FETCH_REQUEST = 'WISHLIST_FETCH_REQUEST';
export const WISHLIST_FETCH_SUCCESS = 'WISHLIST_FETCH_SUCCESS';
export const WISHLIST_FETCH_FAILURE = 'WISHLIST_FETCH_FAILURE';

export const WISHLIST_REMOVE_REQUEST = 'WISHLIST_REMOVE_REQUEST';
export const WISHLIST_MOVE_TO_CART_REQUEST = 'WISHLIST_MOVE_TO_CART_REQUEST';

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

export interface WishlistItem {
  _id: string;
  productId: string;
  product: WishlistProduct;
}

export interface WishlistState {
  loading: boolean;
  items: WishlistItem[];
  error: string | null;
}

export type WishlistActionTypes =
  | { type: typeof WISHLIST_FETCH_REQUEST }
  | { type: typeof WISHLIST_FETCH_SUCCESS; payload: WishlistItem[] }
  | { type: typeof WISHLIST_FETCH_FAILURE; payload: string };
