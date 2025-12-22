export interface CartItemType {
  _id: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  stock: number; // ✅ REQUIRED for disabling logic
}

export interface CartItemProps {
  item: CartItemType;
  updateQty: (id: string, type: 'inc' | 'dec') => void;
  removeItem: (id: string) => void;
}

export type QtyAction = 'inc' | 'dec';
