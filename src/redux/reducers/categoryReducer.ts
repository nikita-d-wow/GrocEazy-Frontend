import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../types/Category';

interface CategoryState {
  categories: Category[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  pagination: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories(
      state,
      action: PayloadAction<
        | Category[]
        | { categories: Category[]; total: number; page: number; pages: number }
      >
    ) {
      if (Array.isArray(action.payload)) {
        state.categories = action.payload;
        state.pagination = null;
      } else {
        state.categories = action.payload.categories;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        };
      }
    },
    addCategory(state, action: PayloadAction<Category>) {
      if (!state.categories) {
        state.categories = [];
      }
      state.categories.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<Category>) {
      const idx = state.categories.findIndex(
        (c) => c._id === action.payload._id
      );
      if (idx !== -1) {
        state.categories[idx] = action.payload;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(
        (c) => c._id !== action.payload
      );
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setLoading,
  setError,
} = categorySlice.actions;

export default categorySlice.reducer;
