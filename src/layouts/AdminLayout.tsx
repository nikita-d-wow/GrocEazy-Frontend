import { Outlet } from 'react-router-dom';
import Header from '../components/customer/Header';
import Footer from '../components/customer/Footer';

export default function AdminLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
