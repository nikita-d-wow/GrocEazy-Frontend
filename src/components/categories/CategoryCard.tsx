import type { FC } from 'react';
import type { Category } from '../../types/Category';
import { categoryBgVariants } from '../../utils/colors';
import OptimizedImage from '../common/OptimizedImage';

interface Props {
  category: Category;
  onClick?: (_id: string) => void;
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
      className={`group ${bg} rounded-2xl p-6 cursor-pointer transition-[transform,background-color] duration-200 hover:-translate-y-1`}
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white p-2 shadow overflow-hidden">
        <OptimizedImage
          src={category.image}
          alt={category.name}
          size="small"
          loading="eager"
          containerClassName="w-full h-full rounded-full"
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h3 className="text-center font-semibold text-gray-900">
        {category.name}
      </h3>
    </div>
  );
};

export default CategoryCard;
