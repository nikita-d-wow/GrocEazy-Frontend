import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import PageHeader from '../../components/common/PageHeader';

import CartItem from '../../components/customer/cart/CartItem';
import CartSummary from '../../components/customer/cart/CartSummary';

import {
  fetchCart,
  updateCartQty,
  removeCartItem,
  clearCart,
} from '../../redux/actions/cartActions';

import {
  fetchWishlist,
  addToWishlist,
} from '../../redux/actions/wishlistActions';

import {
  selectCartItems,
  selectCartLoading,
  selectCartTotal,
  selectCartPagination,
} from '../../redux/selectors/cartSelectors';
import { selectWishlistItems } from '../../redux/selectors/wishlistSelectors';

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
  const wishlistItems = useSelector(selectWishlistItems);
  const total = useSelector(selectCartTotal);
  const { page, totalPages } = useSelector(selectCartPagination);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(page, PAGE_LIMIT));
      dispatch(fetchWishlist(1, 100)); // Fetch wishlist for cross-check
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
    const item = cartItems.find((i) => i._id === cartId);
    if (item && item.product) {
      dispatch(
        addToWishlist(productId, {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.images,
          stock: item.product.stock,
          description: '', // Optional or loaded if available
        })
      );
    } else {
      dispatch(addToWishlist(productId));
    }
    dispatch(removeCartItem(cartId));
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) {
      return;
    }

    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared');
    }
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
  const isEmpty = uiCartItems.length === 0;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-20 py-8">
      <PageHeader
        title="Cart"
        highlightText="My"
        subtitle="Review items before checkout"
        icon={ShoppingCart}
      >
        <button
          onClick={handleClearCart}
          disabled={isEmpty}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all w-fit border shadow-sm ${
            isEmpty
              ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
              : 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100 cursor-pointer active:scale-95'
          }`}
        >
          <Trash2 size={16} />
          Clear Cart
        </button>
      </PageHeader>

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
                  isInWishlist={wishlistItems.some(
                    (wi) => wi.product?._id === item.productId
                  )}
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
                isLoading={loading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
