import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/customer/Header';
import Footer from '../components/customer/Footer';
import type { RootState } from '../redux/rootReducer';

export default function CustomerLayout() {
  const { user } = useSelector((state: RootState) => state.auth);

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
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <Outlet />
        </div>
      </main>

      <Footer />
    </>
  );
}
