export interface Product {
  _id: string;
  name: string;
  description: string;
  size?: string;
  dietary?: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
  images: string[];
  isActive: boolean;
  categoryId: string | { _id: string; name: string };
  category?: { _id: string; name: string } | string;
  createdBy?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating/updating products
export interface ProductFormData {
  name: string;
  description: string;
  size?: string;
  dietary?: string;
  stock: number;
  lowStockThreshold?: number;
  price: number;
  images?: (File | string)[];
  isActive?: boolean;
  categoryId: string;
}

export interface CustomerProductCardProps {
  _id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  categoryId?: string;
  isActive?: boolean;
  onSale?: boolean;
  discountPrice?: number;
}
