import api from './api';
import type { Category, CategoryFormData } from '../types/Category';

/**
 * Get categories with pagination (public or manager)
 */
export const getPagedCategories = async (
  page = 1,
  limit = 20,
  search?: string,
  sortBy?: string
): Promise<{
  categories: Category[];
  total: number;
  page: number;
  pages: number;
}> => {
  const response = await api.get<{
    categories: Category[];
    total: number;
    page: number;
    pages: number;
  }>('/api/categories', {
    params: { page, limit, search, sortBy },
  });
  return response.data;
};

/**
 * Get all categories (public endpoint - legacy support)
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[] | { categories: Category[] }>(
    '/api/categories?limit=100' // High limit for legacy one-time fetch
  );
  return Array.isArray(response.data)
    ? response.data
    : response.data.categories;
};

/**
 * Get a single category by ID
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get<Category | { category: Category }>(
    `/api/categories/${id}`
  );
  // Backend might return { category: {...} } or just the category object
  return 'category' in response.data ? response.data.category : response.data;
};

/**
 * Create a new category (requires auth)
 */
export const createCategory = async (
  data: CategoryFormData
): Promise<Category> => {
  const formData = new FormData();
  formData.append('name', data.name);

  if (data.image) {
    if (data.image instanceof File) {
      formData.append('image', data.image);
    } else {
      formData.append('imageUrl', data.image);
    }
  }

  const response = await api.post<Category | { category: Category }>(
    '/api/categories',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  // Backend might return { category: {...} } or just the category object
  return 'category' in response.data ? response.data.category : response.data;
};

/**
 * Update an existing category (requires auth)
 */
export const updateCategory = async (
  id: string,
  data: CategoryFormData
): Promise<Category> => {
  const formData = new FormData();
  formData.append('name', data.name);

  if (data.image) {
    if (data.image instanceof File) {
      formData.append('image', data.image);
    } else {
      formData.append('imageUrl', data.image);
    }
  }

  const response = await api.put<Category | { category: Category }>(
    `/api/categories/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  // Backend might return { category: {...} } or just the category object
  return 'category' in response.data ? response.data.category : response.data;
};

/**
 * Delete a category (soft delete, requires auth)
 */
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/categories/${id}`);
};
