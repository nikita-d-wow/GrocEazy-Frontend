import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../types/category';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<Category>) {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.categories[idx] = action.payload;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload
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
