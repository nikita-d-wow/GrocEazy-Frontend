export interface Category {
  _id: string;
  name: string;
  image?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating/updating categories
export interface CategoryFormData {
  name: string;
  image?: File | string;
}
