import api from './api';
import type { Product, ProductFormData } from '../types/Product';
import toast from 'react-hot-toast';

/**
 * Get all products (public endpoint)
 */
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[] | { products: Product[] }>(
    '/api/products'
  );
  // Backend might return { products: [...] } or just the array
  return Array.isArray(response.data) ? response.data : response.data.products;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  categoryId: string
): Promise<Product[]> => {
  const response = await api.get<Product[] | { products: Product[] }>(
    `/api/products?categoryId=${categoryId}`
  );
  // Backend might return { products: [...] } or just the array
  return Array.isArray(response.data) ? response.data : response.data.products;
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product | { product: Product }>(
    `/api/products/${id}`
  );
  // Backend might return { product: {...} } or just the product object
  return 'product' in response.data ? response.data.product : response.data;
};

/**
 * Create a new product (requires auth)
 */
export const createProduct = async (
  data: ProductFormData
): Promise<Product> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('stock', data.stock.toString());
  formData.append('categoryId', data.categoryId);

  if (data.size) {
    formData.append('size', data.size);
  }

  if (data.dietary) {
    formData.append('dietary', data.dietary);
  }

  if (data.lowStockThreshold !== undefined) {
    formData.append('lowStockThreshold', data.lowStockThreshold.toString());
  }

  if (data.isActive !== undefined) {
    formData.append('isActive', data.isActive.toString());
  }

  // Handle images (files or URLs)
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      } else if (typeof image === 'string' && image.trim()) {
        formData.append('imageUrls', image);
      }
    });
  }

  const response = await api.post<Product | { product: Product }>(
    '/api/products',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  // Backend might return { product: {...} } or just the product object
  return 'product' in response.data ? response.data.product : response.data;
};

/**
 * Update an existing product (requires auth)
 */
export const updateProduct = async (
  id: string,
  data: ProductFormData
): Promise<Product> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('stock', data.stock.toString());
  formData.append('categoryId', data.categoryId);

  if (data.size) {
    formData.append('size', data.size);
  }

  if (data.dietary) {
    formData.append('dietary', data.dietary);
  }

  if (data.lowStockThreshold !== undefined) {
    formData.append('lowStockThreshold', data.lowStockThreshold.toString());
  }

  if (data.isActive !== undefined) {
    formData.append('isActive', data.isActive.toString());
  }

  // Handle images (files or URLs)
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      } else if (typeof image === 'string' && image.trim()) {
        formData.append('imageUrls', image);
      }
    });
  }

  const response = await api.put<Product | { product: Product }>(
    `/api/products/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  // Backend might return { product: {...} } or just the product object
  return 'product' in response.data ? response.data.product : response.data;
};

/**
 * Delete a product (soft delete, requires auth)
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/api/products/${id}`);
};

/**
 * Get similar products
 */
export const getSimilarProducts = async (
  id: string,
  limit: number = 6
): Promise<Product[]> => {
  const response = await api.get<Product[] | { products: Product[] }>(
    `/api/products/${id}/similar?limit=${limit}`
  );
  return Array.isArray(response.data)
    ? response.data
    : (response.data as any).products || response.data;
};

/**
 * Get top 10 products
 */
export const getTopProducts = async (
  limit: number = 10
): Promise<Product[]> => {
  try {
    const response = await api.get<any>(
      `/api/products/recommendations/top-10?limit=${limit}`
    );

    // Support various backend response formats
    const resData = response.data;
    if (Array.isArray(resData)) {
      return resData;
    }
    if (resData && typeof resData === 'object') {
      if (Array.isArray(resData.products)) {
        return resData.products;
      }
      if (Array.isArray(resData.data)) {
        return resData.data;
      }
      if (Array.isArray(resData.topProducts)) {
        return resData.topProducts;
      }
    }

    return [];
  } catch (error) {
    toast.error('Failed to fetch top products');
    return [];
  }
};
