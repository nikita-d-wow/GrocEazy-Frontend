import Hero from '../../components/customer/Hero';
import CategoriesSection from '../../components/customer/CategorySection';
import PromoSection from '../../components/customer/PromoSection';
import ProductsSection from '../../components/customer/ProductSection';

export default function Dashboard() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <PromoSection />
      <ProductsSection />
    </>
  );
}
