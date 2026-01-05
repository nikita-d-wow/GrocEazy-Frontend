import type { FC } from 'react';
import { useState, useMemo } from 'react';
import {
  X,
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  Edit2,
  Trash2,
} from 'lucide-react';
import DebouncedSearch from '../../common/DebouncedSearch';
import type { Product } from '../../../types/Product';

interface DrilldownProduct extends Product {
  image: string;
}

interface AnalyticsDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  products: DrilldownProduct[];
  type?: 'healthy' | 'low' | 'out' | 'active' | 'inactive' | 'revenue';
  onEdit?: (_product: DrilldownProduct) => void;
  onDelete?: (_id: string) => void;
}

const AnalyticsDrilldownModal: FC<AnalyticsDrilldownModalProps> = ({
  isOpen,
  onClose,
  title,
  products,
  type = 'healthy',
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (!isOpen) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="text-emerald-500" />;
      case 'low':
        return <AlertTriangle className="text-amber-500" />;
      case 'out':
      case 'inactive':
        return <AlertTriangle className="text-rose-500" />;
      default:
        return <Package className="text-primary" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scaleIn">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl">{getIcon()}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-500 text-sm">
                Showing {filteredProducts.length} items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <DebouncedSearch
            placeholder="Search within these products..."
            onSearch={setSearchTerm}
            className="max-w-md"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProducts.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-gray-50 rounded-full">
                <Search size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No matches found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-50 shrink-0">
                    <img
                      src={p.image || 'https://via.placeholder.com/150'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-medium text-primary">
                        ₹{p.price.toFixed(2)}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          p.stock === 0
                            ? 'bg-rose-50 text-rose-600'
                            : p.stock <= 5
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 scale-90 sm:scale-100">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(p)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                        title="Edit Product"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(p._id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDrilldownModal;
