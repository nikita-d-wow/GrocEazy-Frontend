import { Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Header from '../components/customer/Header';
import Footer from '../components/customer/Footer';
import FloatingCartBar from '../components/customer/cart/FloatingCartBar';
import type { RootState } from '../redux/rootReducer';
import type { AppDispatch } from '../redux/store';
import { fetchCart } from '../redux/actions/cartActions';
import { fetchWishlist } from '../redux/actions/wishlistActions';

export default function CustomerLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.role === 'customer') {
      dispatch(fetchCart(1, 100)); // Populate cart itemMap
      dispatch(fetchWishlist(1, 500, true)); // Populate wishlist idMap (silently)
    }
  }, [dispatch, user]);

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === 'manager') {
    return <Navigate to="/manager" replace />;
  }

  return (
    <>
      <Header />

      {/* PAGE CONTAINER */}
      <main className="min-h-screen pt-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <Outlet />
        </div>
      </main>

      <Footer />
      <FloatingCartBar />
    </>
  );
}
