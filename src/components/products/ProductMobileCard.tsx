import type { FC } from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils';
import type { Product } from '../../types/Product';

interface ProductMobileCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  index: number;
}

const ProductMobileCard: FC<ProductMobileCardProps> = ({
  product,
  onEdit,
  onDelete,
  index,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 animate-slideUp ${!product.isActive ? 'opacity-60' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="h-20 w-20 rounded-2xl bg-white p-1.5 flex-shrink-0 shadow-sm border border-gray-100/50">
          <img
            className="h-full w-full rounded-xl object-cover"
            src={
              optimizeCloudinaryUrl(product.images?.[0]) ||
              `https://ui-avatars.com/api/?name=${product.name}`
            }
            alt={product.name}
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-base font-bold text-gray-900 truncate">
                {product.name}
              </h1>
              {product.size && (
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {product.size}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-base font-bold text-green-700">
                ₹{product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Status */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {/* Stock Badge */}
          {Number(product.stock) === 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
              <AlertTriangle size={10} />
              Stock: 0
            </span>
          ) : product.stock <= (product.lowStockThreshold || 5) ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
              <AlertTriangle size={10} />
              Low ({product.stock})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
              <CheckCircle size={10} />
              In Stock ({product.stock})
            </span>
          )}

          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              product.isActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-gray-50 text-gray-600 border-gray-100'
            }`}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200"
            title="Edit product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductMobileCard;
