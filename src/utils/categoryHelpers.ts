import type { Category } from '../types/Category';

/**
 * Get only parent categories (categories without a parent)
 */
export const getParentCategories = (categories: Category[]): Category[] => {
  return categories.filter((cat) => !cat.parentCategoryId && !cat.isDeleted);
};

/**
 * Get subcategories of a specific parent category
 */
export const getSubcategories = (
  categories: Category[],
  parentId: string
): Category[] => {
  return categories.filter(
    (cat) => cat.parentCategoryId === parentId && !cat.isDeleted
  );
};

/**
 * Check if a category has subcategories
 */
export const hasSubcategories = (
  categories: Category[],
  parentId: string
): boolean => {
  return categories.some(
    (cat) => cat.parentCategoryId === parentId && !cat.isDeleted
  );
};

/**
 * Get all category IDs including parent and all its children
 */
export const getCategoryIdsWithChildren = (
  categories: Category[],
  categoryId: string
): string[] => {
  const subcategories = getSubcategories(categories, categoryId);
  return [categoryId, ...subcategories.map((cat) => cat._id)];
};

/**
 * Format categories for hierarchical dropdown display
 */
export const formatCategoriesForDropdown = (
  categories: Category[]
): Array<{ value: string; label: string; isSubcategory: boolean }> => {
  const result: Array<{
    value: string;
    label: string;
    isSubcategory: boolean;
  }> = [];
  const parentCategories = getParentCategories(categories);

  parentCategories.forEach((parent) => {
    // Add parent category
    result.push({
      value: parent._id,
      label: parent.name,
      isSubcategory: false,
    });

    // Add its subcategories
    const subcategories = getSubcategories(categories, parent._id);
    subcategories.forEach((sub) => {
      result.push({
        value: sub._id,
        label: `  ↳ ${sub.name}`,
        isSubcategory: true,
      });
    });
  });

  return result;
};
