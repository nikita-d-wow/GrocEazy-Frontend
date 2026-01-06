import type { AppDispatch } from '../store';
import type { CategoryFormData } from '../../types/Category';
import * as categoryApi from '../../services/categoryApi';
import {
  setCategories,
  setLoading,
  setError,
  addCategory as addCategoryAction,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
} from '../reducers/categoryReducer';

/**
 * Fetch categories with pagination
 */
export const fetchPagedCategories =
  (page = 1, limit = 20, search?: string, sortBy?: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await categoryApi.getPagedCategories(
        page,
        limit,
        search,
        sortBy
      );
      dispatch(setCategories(data));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || 'Failed to fetch categories')
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Fetch all categories (standard list for sidebar/dropdowns)
 */
export const fetchCategories =
  () => async (dispatch: AppDispatch, getState: () => any) => {
    const { categories, loading, pagination } = getState().category;

    // If already loading, or if we have categories AND they are NOT paginated (meaning full list), return.
    // If pagination is present, it means we have a subset, so we MUST fetch all.
    if (loading || (categories.length > 0 && pagination === null)) {
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const categories = await categoryApi.getCategories();
      dispatch(setCategories(categories));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || 'Failed to fetch categories')
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Create a new category
 */
export const createCategory =
  (data: CategoryFormData) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const category = await categoryApi.createCategory(data);
      dispatch(addCategoryAction(category));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || 'Failed to create category')
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Update an existing category
 */
export const updateCategory =
  (id: string, data: CategoryFormData) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const category = await categoryApi.updateCategory(id, data);
      dispatch(updateCategoryAction(category));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || 'Failed to update category')
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Delete a category
 */
export const deleteCategory = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    await categoryApi.deleteCategory(id);
    dispatch(deleteCategoryAction(id));
  } catch (error: any) {
    dispatch(
      setError(error.response?.data?.message || 'Failed to delete category')
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};
