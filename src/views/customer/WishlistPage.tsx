import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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

import type { RootState } from '../../redux/rootReducer';

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector(selectWishlistItems);
  const loading = useSelector(selectWishlistLoading);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

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
    </div>
  );
}
