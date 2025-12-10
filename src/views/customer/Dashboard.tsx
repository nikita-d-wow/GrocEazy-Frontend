import Header from '../../components/customer/Header';
import Hero from '../../components/customer/Hero';
import CategoriesSection from '../../components/customer/CategorySection';
import PromoSection from '../../components/customer/PromoSection';
import ProductsSection from '../../components/customer/ProductSection';
import Footer from '../../components/customer/Footer';
export default function Dashboard() {
  return (
    <>
      <Header />
      <Hero />
      <CategoriesSection />
      <PromoSection />
      <ProductsSection />
      <Footer />
    </>
  );
}
