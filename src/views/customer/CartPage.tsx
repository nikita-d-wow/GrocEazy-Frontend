import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';

import CartItem from '../../components/customer/cart/CartItem';
import CartSummary from '../../components/customer/cart/CartSummary';
import CartHeader from '../../components/customer/cart/CartHeader';

import {
  fetchCart,
  updateCartQty,
  removeCartItem,
} from '../../redux/actions/cartActions';

import { addToWishlist } from '../../redux/actions/wishlistActions';

import {
  selectCartItems,
  selectCartLoading,
  selectCartTotal,
  selectCartPagination,
} from '../../redux/selectors/cartSelectors';

import type { AppDispatch } from '../../redux/store';
import type { RootState } from '../../redux/rootReducer';

type QtyAction = 'inc' | 'dec';

interface CartItemUI {
  _id: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  stock: number;
}

const PAGE_LIMIT = 8;

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  const loading = useSelector(selectCartLoading);
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { page, totalPages } = useSelector(selectCartPagination);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(page, PAGE_LIMIT));
    }
  }, [dispatch, user, page]);

  /* ================= ACTIONS ================= */
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

  const moveToWishlist = (cartId: string, productId: string) => {
    dispatch(addToWishlist(productId));
    dispatch(removeCartItem(cartId));
  };

  /* ================= AUTH GUARD ================= */
  if (!user) {
    return (
      <div className="min-h-screen px-4 py-8">
        <EmptyState
          title="Please Log In"
          description="You need to be logged in to view your cart."
          icon={<ShoppingCart size={48} className="text-gray-400" />}
          action={{
            label: 'Sign In',
            onClick: () => navigate('/login'),
          }}
        />
      </div>
    );
  }

  if (loading && cartItems.length === 0) {
    return <Loader />;
  }

  /* ================= UI MAPPING ================= */
  const uiCartItems: CartItemUI[] = cartItems
    .filter((item) => item.product && item.product._id)
    .map((item) => ({
      _id: item._id,
      productId: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] ?? '',
      unitPrice: item.product.price,
      quantity: item.quantity,
      stock: item.product.stock,
    }));

  const formattedTotal = Number(total).toFixed(2);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-20 py-8">
      <CartHeader />

      {uiCartItems.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Start adding items to see them here!"
          icon={<ShoppingCart size={48} className="text-primary" />}
        />
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-4 min-w-0">
              {uiCartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  updateQty={updateQty}
                  removeItem={removeItem}
                  moveToWishlist={moveToWishlist}
                />
              ))}
            </div>

            {/* RIGHT */}
            <div className="w-full max-w-full">
              <CartSummary total={Number(formattedTotal)} />
            </div>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) =>
                  dispatch(fetchCart(newPage, PAGE_LIMIT))
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
