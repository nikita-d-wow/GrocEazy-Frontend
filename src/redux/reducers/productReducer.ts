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
  searchQuery: string;
  searchResults: Product[];
  searchLoading: boolean;
  analyticsProducts: Product[];
  analyticsLoading: boolean;
  productDetails: Product | null;
}

const initialState: ProductState = {
  products: [],
  similarProducts: [],
  topProducts: [],
  loading: false,
  error: null,
  pagination: null,
  searchQuery: '',
  searchResults: [],
  searchLoading: false,
  analyticsProducts: [],
  analyticsLoading: false,
  productDetails: null,
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

      // Keep analytics products in sync if they exist
      if (state.analyticsProducts && state.analyticsProducts.length > 0) {
        state.analyticsProducts.push(action.payload);
      }
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const updateArray = (arr: Product[]) => {
        const index = arr.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          arr[index] = action.payload;
        }
      };

      updateArray(state.products);
      updateArray(state.analyticsProducts);
      updateArray(state.searchResults);
      updateArray(state.topProducts);
      updateArray(state.similarProducts);
    },
    deleteProduct(state, action: PayloadAction<string>) {
      const filterArray = (arr: Product[]) =>
        arr.filter((p) => p._id !== action.payload);

      state.products = filterArray(state.products);
      state.analyticsProducts = filterArray(state.analyticsProducts);
      state.searchResults = filterArray(state.searchResults);
      state.topProducts = filterArray(state.topProducts);
      state.similarProducts = filterArray(state.similarProducts);
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
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload.trim();
    },
    setSearchResults(state, action: PayloadAction<Product[]>) {
      state.searchResults = action.payload;
    },
    setSearchLoading(state, action: PayloadAction<boolean>) {
      state.searchLoading = action.payload;
    },
    setAnalyticsProducts(state, action: PayloadAction<Product[]>) {
      state.analyticsProducts = action.payload;
    },
    setAnalyticsLoading(state, action: PayloadAction<boolean>) {
      state.analyticsLoading = action.payload;
    },
    setProductDetails(state, action: PayloadAction<Product | null>) {
      state.productDetails = action.payload;
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
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  setAnalyticsProducts,
  setAnalyticsLoading,
  setProductDetails,
} = productSlice.actions;

export default productSlice.reducer;
