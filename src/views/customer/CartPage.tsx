import { useState } from 'react';

import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';

import CartItem from '../../components/customer/cart/CartItem';
import CartSummary from '../../components/customer/cart/CartSummary';
import CartHeader from '../../components/customer/cart/CartHeader';

import { CART_DATA } from '../../data/cartdata';
import type { CartItemType, QtyAction } from '../../types/Cart';
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>(CART_DATA);

  const updateQty = (id: string, type: QtyAction) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                type === 'inc'
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  if (loading) {
    return <Loader />;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-6 md:px-10 lg:px-24 py-12">
      <CartHeader />

      {cartItems.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Start adding items to see them here!"
          icon={<ShoppingCart size={48} className="text-primary" />}
        />
      ) : (
        <div className="mt-6 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                updateQty={updateQty}
                removeItem={removeItem}
              />
            ))}
          </div>

          <CartSummary total={total} />
        </div>
      )}
    </div>
  );
}
