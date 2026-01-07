import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ChevronLeft } from 'lucide-react';

import { fetchWishlist } from '../../redux/actions/wishlistActions';
import { fetchCart } from '../../redux/actions/cartActions';

import {
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistPagination,
} from '../../redux/selectors/wishlistSelectors';

import type { AppDispatch } from '../../redux/store';
import type { RootState } from '../../redux/rootReducer';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import WishlistGrid from '../../components/customer/wishlist/WishlistGrid';

const PAGE_LIMIT = 6;

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const items = useSelector(selectWishlistItems);
  const loading = useSelector(selectWishlistLoading);
  const { page, totalPages } = useSelector(selectWishlistPagination);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist(page, PAGE_LIMIT));
      dispatch(fetchCart(1, 100)); // Fetch cart to check for existing items
    }
  }, [dispatch, user, page]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <EmptyState
          title="Please Log In"
          description="You need to be logged in to view your wishlist."
          icon={
            <div className="p-4 bg-muted rounded-full">
              <Heart size={48} className="text-muted-text opacity-30" />
            </div>
          }
          action={{
            label: 'Sign In',
            onClick: () => navigate('/login'),
          }}
        />
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <EmptyState
          icon={
            <div className="relative group">
              <div className="absolute inset-0 bg-rose-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <Heart
                size={64}
                className="text-rose-500 relative fill-rose-500/10 drop-shadow-xl animate-pulse"
              />
            </div>
          }
          title="Your wishlist is empty"
          description="Save items you love and find them here 💖"
          action={{
            label: 'Continue Shopping',
            onClick: () => navigate('/products'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fadeDown">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-sm">
                <Heart size={24} className="text-rose-500 fill-rose-500" />
              </div>
              <h1 className="text-4xl font-black text-text tracking-tight">
                My Wishlist
              </h1>
            </div>
            <p className="text-muted-text font-medium flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-500" />
              Keep track of products you want to buy later
            </p>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-2xl text-sm font-bold text-text hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all active:scale-95 group cursor-pointer"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Continue Shopping
          </button>
        </div>

        <WishlistGrid items={items} />

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => dispatch(fetchWishlist(p, PAGE_LIMIT))}
              isLoading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
