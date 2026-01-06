import type { AxiosError } from 'axios';
import type { AppDispatch } from '../store';
import type { ProductFormData } from '../../types/Product';
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
  setSearchResults,
  setSearchLoading,
  setAnalyticsProducts,
  setAnalyticsLoading,
} from '../reducers/productReducer';

/**
 * Fetch products for customer (public endpoint)
 */
export const fetchProducts =
  (
    page?: number,
    limit?: number,
    search?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: string
  ) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const data = await productApi.getProducts(
          page,
          limit,
          search,
          categoryId,
          minPrice,
          maxPrice,
          sortBy
        );
        dispatch(setProducts(data));
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        dispatch(
          setError(err.response?.data?.message || 'Failed to fetch products')
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

export const fetchManagerProducts =
  (
    page = 1,
    limit = 20,
    search?: string,
    isActive?: boolean,
    stockStatus?: string,
    categoryId?: string
  ) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        console.log('Redux fetchManagerProducts:', { page, limit, search, isActive, stockStatus, categoryId });
        const data = await productApi.getManagerProducts(
          page,
          limit,
          search,
          isActive,
          stockStatus,
          categoryId
        );
        dispatch(setProducts(data));
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        dispatch(
          setError(err.response?.data?.message || 'Failed to fetch products')
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
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        setError(err.response?.data?.message || 'Failed to create product')
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
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        setError(err.response?.data?.message || 'Failed to update product')
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
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(
      setError(err.response?.data?.message || 'Failed to delete product')
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
    // Optimized: Fetch in background without blocking global loading state
    try {
      const products = await productApi.getSimilarProducts(id);
      dispatch(setSimilarProducts(products));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        setError(
          err.response?.data?.message || 'Failed to fetch similar products'
        )
      );
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
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(
      setError(err.response?.data?.message || 'Failed to fetch top products')
    );
    // Fallback: set empty if failed, UI will handle with products fallback
    dispatch(setTopProducts([]));
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Global search products (backend results, high limit)
 */
export const searchProductsGlobally =
  (search: string) => async (dispatch: AppDispatch) => {
    if (!search.trim()) {
      dispatch(setSearchResults([]));
      return;
    }

    dispatch(setSearchLoading(true));
    try {
      // Fetch matching items across all categories/pages
      const data = await productApi.getProducts(
        1,
        50, // High limit for search results
        search
      );
      dispatch(setSearchResults(data.products || data));
    } catch (error) {
      // Silently fail or log to a service (but not console in production-lite linting)
      dispatch(setSearchResults([]));
    } finally {
      dispatch(setSearchLoading(false));
    }
  };

/**
 * Fetch all products for analytics (unpaginated, includes inactive)
 */
export const fetchAnalyticsProducts = () => async (dispatch: AppDispatch) => {
  dispatch(setAnalyticsLoading(true));
  try {
    const products = await productApi.getAnalyticsProducts();
    dispatch(setAnalyticsProducts(products));
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(
      setError(
        err.response?.data?.message || 'Failed to fetch analytics products'
      )
    );
  } finally {
    dispatch(setAnalyticsLoading(false));
  }
};
