import type { FC } from 'react';
import type { Category } from '../../types/Category';
import CategoryCard from './CategoryCard';
import EmptyState from '../common/EmptyState';
import { Search } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  onCategoryClick?: (id: string) => void;
}

const CategoryGrid: FC<CategoryGridProps> = ({
  categories,
  onCategoryClick,
}) => {
  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        title="No Categories"
        description="We couldn't find any categories at the moment."
        icon={<Search size={48} />}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {categories.map((cat, index) => (
        <CategoryCard
          key={cat._id}
          category={cat}
          onClick={onCategoryClick}
          index={index}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
