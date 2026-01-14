import { Outlet } from 'react-router-dom';
import Header from '../components/customer/Header';
import Footer from '../components/customer/Footer';

export default function ManagerLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-[1400px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
