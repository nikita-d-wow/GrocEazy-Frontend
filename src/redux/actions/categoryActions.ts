import type { AppDispatch } from '../store';
import type { Category, CategoryFormData } from '../../types/Category';
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
 * Fetch all categories
 */
export const fetchCategories = () => async (dispatch: AppDispatch) => {
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
