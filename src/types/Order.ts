export interface Address {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  placedAt: string;
  address: Address;
  items: OrderItem[];
}
