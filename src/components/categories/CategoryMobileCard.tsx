import type { FC } from 'react';
import { Edit2, Trash2, Calendar, Package } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils';
import type { Category } from '../../types/Category';

interface CategoryMobileCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  index: number;
}

const CategoryMobileCard: FC<CategoryMobileCardProps> = ({
  category,
  onEdit,
  onDelete,
  index,
}) => {
  return (
    <div
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 animate-slideUp"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center space-x-4">
        {/* Category Image */}
        <div className="h-16 w-16 rounded-2xl bg-white p-1.5 flex-shrink-0 shadow-sm border border-gray-100/50">
          <img
            className="h-full w-full rounded-xl object-cover"
            src={
              optimizeCloudinaryUrl(category.image, 64) ||
              `https://ui-avatars.com/api/?name=${category.name}`
            }
            alt={category.name}
            loading="lazy"
          />
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-900 truncate">
            {category.name}
          </h1>
        </div>
      </div>

      {/* Actions & Info */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <Package size={10} />
            {category.productCount || 0}{' '}
            {category.productCount === 1 ? 'Product' : 'Products'}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            <Calendar size={10} />
            {new Date(category.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200"
            title="Edit category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category._id)}
            className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryMobileCard;
