export interface WishlistItem {
  _id: string;
  name: string;
  description: string;
  size: string;
  dietary: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
  images: string[];
  isActive: boolean;
  categoryId: string;
}
