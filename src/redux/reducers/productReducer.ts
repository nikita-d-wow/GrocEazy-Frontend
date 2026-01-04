import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/Product';

interface ProductState {
  products: Product[];
  similarProducts: Product[];
  topProducts: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  } | null;
}

const initialState: ProductState = {
  products: [],
  similarProducts: [],
  topProducts: [],
  loading: false,
  error: null,
  pagination: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts(
      state,
      action: PayloadAction<
        | Product[]
        | {
            products: Product[];
            total: number;
            page: number;
            pages: number;
            limit: number;
          }
      >
    ) {
      if (Array.isArray(action.payload)) {
        state.products = action.payload;
        state.pagination = null;
      } else {
        state.products = action.payload.products;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
          limit: action.payload.limit,
        };
      }
    },
    addProduct(state, action: PayloadAction<Product>) {
      if (!state.products) {
        state.products = [];
      }
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSimilarProducts(state, action: PayloadAction<Product[]>) {
      state.similarProducts = action.payload;
    },
    setTopProducts(state, action: PayloadAction<Product[]>) {
      state.topProducts = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
  setSimilarProducts,
  setTopProducts,
} = productSlice.actions;

export default productSlice.reducer;
