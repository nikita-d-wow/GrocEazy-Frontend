import type { FC } from 'react';
import type { Category } from '../../types/Category';
import { categoryBgVariants } from '../../utils/colors';

interface Props {
  category: Category;
  // eslint-disable-next-line no-unused-vars
  onClick?: (id: string) => void;
  index?: number;
}

const CategoryCard: FC<Props> = ({ category, onClick, index }) => {
  const bg =
    categoryBgVariants[
      (index !== undefined ? index : category.name.length) %
        categoryBgVariants.length
    ];

  return (
    <div
      onClick={() => onClick?.(category._id)}
      className={`group ${bg} rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 shadow-sm border border-border/50`}
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-card p-2 shadow border border-border/50">
        <img
          src={
            category.image ||
            `https://ui-avatars.com/api/?name=${category.name}`
          }
          alt={category.name}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-center font-semibold text-text">{category.name}</h3>
    </div>
  );
};

export default CategoryCard;
