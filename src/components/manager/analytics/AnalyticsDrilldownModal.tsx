import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';
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
import FilterSelect from '../../common/FilterSelect';
import { optimizeCloudinaryUrl } from '../../../utils/imageUtils';
import type { Product } from '../../../types/Product';
import { ProductCardSkeleton } from '../../common/Skeleton';

interface DrilldownProduct extends Product {
  image: string;
}

interface AnalyticsDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  products: DrilldownProduct[];
  type?: 'healthy' | 'low' | 'out' | 'active' | 'inactive' | 'revenue';
  // eslint-disable-next-line no-unused-vars
  onEdit?: (_product: DrilldownProduct) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (_id: string) => void;
}

const DrilldownContent: FC<AnalyticsDrilldownModalProps> = ({
  onClose,
  title,
  products,
  type = 'healthy',
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  // Artificial loading delay on mount
  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      // Unlock scroll on unmount
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
      // Reset search and sort when component unmounts (modal closes)
      setSearchTerm('');
      setSortBy('default');
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search Filter
    if (searchTerm.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort Logic
    switch (sortBy) {
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'stock-asc':
        result = [...result].sort((a, b) => a.stock - b.stock);
        break;
      default:
        break;
    }

    return result;
  }, [products, searchTerm, sortBy]);

  const getIcon = () => {
    switch (type) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="text-emerald-500" size={20} />;
      case 'low':
        return <AlertTriangle className="text-amber-500" size={20} />;
      case 'out':
      case 'inactive':
        return <AlertTriangle className="text-rose-500" size={20} />;
      default:
        return <Package className="text-primary" size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn transition-all duration-500"
        onClick={onClose}
      />

      <div className="relative bg-card w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col animate-scaleIn border border-border overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-5 flex items-center justify-between bg-card border-b border-border sticky top-0 z-10 rounded-t-[2rem]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-muted rounded-t-[2rem] sm:rounded-xl shadow-inner border border-border">
              {getIcon()}
            </div>
            <div>
              <h2 className="text-xl font-black text-text tracking-tight">
                {title}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-muted-text text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" />
                  {filteredProducts.length} items
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-500/10 hover:text-rose-500 text-muted-text rounded-xl transition-all duration-300 group cursor-pointer"
          >
            <X
              size={18}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="px-6 py-4 bg-muted/50 border-b border-border flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 relative z-20">
          <div className="w-full sm:w-auto flex-shrink-0">
            <FilterSelect
              label="Sort"
              options={[
                { value: 'default', label: 'Default' },
                { value: 'name-asc', label: 'Name (A-Z)' },
                { value: 'price-asc', label: 'Price (L-H)' },
                { value: 'price-desc', label: 'Price (H-L)' },
                { value: 'stock-asc', label: 'Stock (L-H)' },
              ]}
              value={sortBy}
              onChange={setSortBy}
              className="w-full sm:w-48"
            />
          </div>
          <div className="w-full sm:flex-1 sm:max-w-xs relative group pb-1 sm:pb-0">
            <span className="text-[9px] font-bold text-muted-text uppercase tracking-widest ml-1 mb-1.5 block">
              Search
            </span>
            <DebouncedSearch
              placeholder="Search products..."
              onSearch={setSearchTerm}
              initialValue={searchTerm}
              className="w-full"
              showIcon={false}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2 custom-scrollbar bg-card scroll-smooth rounded-b-[2rem]">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-6 bg-muted rounded-[2.5rem] animate-pulse border border-border">
                <Search size={48} className="text-muted-text opacity-20" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-text">No results found</p>
                <p className="text-muted-text text-xs font-medium">
                  Try checking your keywords
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="group relative flex flex-col gap-2 p-2.5 rounded-[1.5rem] bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border">
                    <img
                      src={
                        optimizeCloudinaryUrl(p.image, 400) ||
                        'https://via.placeholder.com/150'
                      }
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div>
                      <h4 className="font-bold text-text tracking-tight text-[10px] leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                        {p.name}
                      </h4>
                      {p.category && (
                        <p className="text-[7px] font-bold text-muted-text uppercase tracking-wider mt-0.5">
                          {typeof p.category === 'object'
                            ? p.category.name
                            : p.category}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[11px] font-black text-text">
                        ₹{p.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-[7px] font-black px-1.5 py-0.5 rounded-full border ${
                          p.stock === 0
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : p.stock <= 5
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}
                      >
                        {p.stock === 0 ? 'Out' : p.stock}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Overlay */}
                  <div className="flex items-center gap-1 mt-1 pt-2 border-t border-border">
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(p);
                        }}
                        className="flex-1 py-1.5 flex items-center justify-center gap-1 bg-muted hover:bg-emerald-600 hover:text-white text-muted-text rounded-lg transition-all duration-300 font-bold text-[8px] cursor-pointer"
                      >
                        <Edit2 size={9} />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(p._id);
                        }}
                        className="p-1 text-muted-text hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <Trash2 size={10} />
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

const AnalyticsDrilldownModal: FC<AnalyticsDrilldownModalProps> = (props) => {
  if (!props.isOpen) {
    return null;
  }
  return <DrilldownContent {...props} />;
};

export default AnalyticsDrilldownModal;
