import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

import { fetchWishlist } from '../../redux/actions/wishlistActions';

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
    }
  }, [dispatch, user, page]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <EmptyState
          title="Please Log In"
          description="You need to be logged in to view your wishlist."
          icon={<Heart size={48} className="text-gray-400" />}
          action={{
            label: 'Sign In',
            onClick: () => navigate('/login'),
          }}
        />
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <EmptyState
          icon={<Heart size={48} className="text-pink-400" />}
          title="Your wishlist is empty"
          description="Save items you love and find them here 💖"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Wishlist</h1>

      <WishlistGrid items={items} />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => dispatch(fetchWishlist(p, PAGE_LIMIT))}
          />
        </div>
      )}
    </div>
  );
}
