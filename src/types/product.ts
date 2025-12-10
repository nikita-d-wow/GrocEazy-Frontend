export interface VariantOption {
  value: string;
  priceModifier?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  categoryId: string;
  variants?: ProductVariant[];
  rating?: number;
  reviewsCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}
