import type { AppDispatch } from '../store';
import type { Product, ProductFormData } from '../../types/Product';
import toast from 'react-hot-toast';
import * as productApi from '../../services/productApi';
import {
  setProducts,
  setLoading,
  setError,
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  setSimilarProducts,
  setTopProducts,
} from '../reducers/productReducer';

/**
 * Fetch all products
 */
export const fetchProducts = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const products = await productApi.getProducts();
    dispatch(setProducts(products));
  } catch (error: any) {
    dispatch(
      setError(error.response?.data?.message || 'Failed to fetch products')
    );
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Fetch products by category
 */
export const fetchProductsByCategory =
  (categoryId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const products = await productApi.getProductsByCategory(categoryId);
      dispatch(setProducts(products));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || 'Failed to fetch products')
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Create a new product
 */
export const createProduct =
  (data: ProductFormData) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const product = await productApi.createProduct(data);
      dispatch(addProductAction(product));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || 'Failed to create product')
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Update an existing product
 */
export const updateProduct =
  (id: string, data: ProductFormData) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const product = await productApi.updateProduct(id, data);
      dispatch(updateProductAction(product));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || 'Failed to update product')
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Delete a product
 */
export const deleteProduct = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    await productApi.deleteProduct(id);
    dispatch(deleteProductAction(id));
  } catch (error: any) {
    dispatch(
      setError(error.response?.data?.message || 'Failed to delete product')
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};
/**
 * Fetch similar products
 */
export const fetchSimilarProducts =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const products = await productApi.getSimilarProducts(id);
      dispatch(setSimilarProducts(products));
    } catch (error: any) {
      toast.error('Error fetching similar products:', error);
      // Don't set main error state to avoid blocking main UI
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Fetch top products
 */
export const fetchTopProducts = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const products = await productApi.getTopProducts();
    dispatch(setTopProducts(products));
  } catch (error: any) {
    toast.error('Error fetching top products:', error);
  } finally {
    dispatch(setLoading(false));
  }
};
