import { ShoppingCart } from 'lucide-react';

export default function CartHeader() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 animate-fadeDown">
        <ShoppingCart size={32} className="text-primary" />
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Your Cart
        </h1>
      </div>
      <p className="text-gray-600 mb-6 animate-fadeDown">
        Review items before checkout
      </p>
    </div>
  );
}
