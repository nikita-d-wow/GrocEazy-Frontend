import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';

import CartItem from '../../components/customer/cart/CartItem';
import CartSummary from '../../components/customer/cart/CartSummary';
import CartHeader from '../../components/customer/cart/CartHeader';

import {
  fetchCart,
  updateCartQty,
  removeCartItem,
} from '../../redux/actions/cartActions';

import {
  selectCartItems,
  selectCartLoading,
  selectCartTotal,
} from '../../redux/selectors/cartSelectors';

import type { AppDispatch } from '../../redux/store';
import { ShoppingCart } from 'lucide-react';

type QtyAction = 'inc' | 'dec';

interface CartItemUI {
  _id: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(selectCartLoading);
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const updateQty = (cartId: string, type: QtyAction) => {
    const item = cartItems.find((i) => i._id === cartId);
    if (!item) {
      return;
    }

    const newQty =
      type === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    dispatch(updateCartQty(cartId, newQty));
  };

  const removeItem = (cartId: string) => {
    dispatch(removeCartItem(cartId));
  };

  if (loading && cartItems.length === 0) {
    return <Loader />;
  }

  const uiCartItems: CartItemUI[] = cartItems
    .filter((item) => item.product && item.product._id)
    .map((item) => ({
      _id: item._id,
      productId: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] ?? '',
      unitPrice: item.product.price,
      quantity: item.quantity,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-6 md:px-10 lg:px-24 py-12">
      <CartHeader />

      {uiCartItems.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Start adding items to see them here!"
          icon={<ShoppingCart size={48} className="text-primary" />}
        />
      ) : (
        <div className="mt-6 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            {uiCartItems.map((item) => (
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
