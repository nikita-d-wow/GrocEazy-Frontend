import CategoryCard from './CategoryCard';
import { categories } from '../../utils/categories';

export interface Category {
  text: string;
  path: string;
  image: string;
  bgColor: string;
}

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
      <h2 className="text-3xl font-bold mb-8">Shop By Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {categories.map((cat, index) => (
          <CategoryCard key={index} {...cat} />
        ))}
      </div>
    </section>
  );
}
