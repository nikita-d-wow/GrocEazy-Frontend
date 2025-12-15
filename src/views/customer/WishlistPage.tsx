import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';

import { fetchWishlist } from '../../redux/actions/wishlistActions';

import {
  selectWishlistItems,
  selectWishlistLoading,
} from '../../redux/selectors/wishlistSelectors';

import type { AppDispatch } from '../../redux/store';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import WishlistGrid from '../../components/customer/wishlist/WishlistGrid';

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectWishlistItems);
  const loading = useSelector(selectWishlistLoading);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

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
    </div>
  );
}
