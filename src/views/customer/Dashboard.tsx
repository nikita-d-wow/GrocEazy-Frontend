import Hero from '../../components/customer/Hero';
import CategoriesSection from '../../components/customer/CategorySection';
import PromoSection from '../../components/customer/PromoSection';
import ProductsSection from '../../components/customer/ProductSection';
import FloatingCategoryBar from '../../components/customer/FloatingCategoryBar';

export default function Dashboard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 opacity-80 pointer-events-none" />
      <div className="relative z-10">
        <FloatingCategoryBar />
        <Hero />
        <CategoriesSection />
        <PromoSection />
        <ProductsSection />
      </div>
    </div>
  );
}
