import { Outlet } from 'react-router-dom';
import Header from '../components/customer/Header';
import Footer from '../components/customer/Footer';

export default function CustomerLayout() {
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
