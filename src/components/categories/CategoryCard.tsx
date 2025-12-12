import type { FC } from 'react';
import type { Category } from '../../types/Category';
import { categoryBgVariants } from '../../utils/colors';

interface Props {
  category: Category;
  onClick?: (id: string) => void;
}

const CategoryCard: FC<Props> = ({ category, onClick }) => {
  const bg =
    categoryBgVariants[category.name.length % categoryBgVariants.length];

  return (
    <div
      onClick={() => onClick?.(category.id)}
      className={`group ${bg} rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1`}
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white p-2 shadow">
        <img
          src={
            category.image ||
            `https://ui-avatars.com/api/?name=${category.name}`
          }
          alt={category.name}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-center font-semibold text-gray-900">
        {category.name}
      </h3>
      {category.description && (
        <p className="text-xs text-gray-500 text-center mt-1">
          {category.description}
        </p>
      )}
    </div>
  );
};

export default CategoryCard;
