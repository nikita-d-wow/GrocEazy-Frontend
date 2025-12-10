import { Outlet } from 'react-router-dom';
import Header from '../components/customer/Header';
import Footer from '../components/customer/Footer';

export default function CustomerLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
