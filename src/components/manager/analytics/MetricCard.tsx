import type { ReactNode } from 'react';
import { PackageSearch } from 'lucide-react';

interface ProductItem {
  _id: string;
  name: string;
  stock: number;
}

export default function MetricCard({
  title,
  value,
  icon,
  bg,
  productList,
  onClick,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  bg: string;
  productList?: ProductItem[];
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        glass-card p-6
        relative overflow-visible group hover:scale-[1.02] transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div
        className={`absolute inset-0 opacity-15 bg-gradient-to-br ${bg} rounded-2xl`}
      />

      <div className="relative flex items-center justify-between z-10">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {onClick && (
              <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view all
              </span>
            )}
          </div>
        </div>

        <div
          className={`
            p-3.5 rounded-2xl
            bg-gradient-to-br ${bg}
            text-white shadow-sm
          `}
        >
          {icon}
        </div>
      </div>

      {/* TOOLTIP / POPOVER */}
      {productList && productList.length > 0 && (
        <div
          className="
            invisible group-hover:visible
            opacity-0 group-hover:opacity-100
            absolute top-full left-0 right-0 mt-4 z-[100]
            bg-white/95 backdrop-blur-xl border border-gray-100
            rounded-2xl shadow-2xl p-4
            transition-all duration-300 transform translate-y-2 group-hover:translate-y-0
            pointer-events-none
          "
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
            <PackageSearch size={14} className="text-gray-400" />
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Preview
            </span>
            <span className="ml-auto bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
              {productList.length} items
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
            {productList.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between gap-3 p-1.5 rounded-lg border border-transparent"
              >
                <span className="text-xs text-gray-700 truncate font-medium">
                  {product.name}
                </span>
                <span
                  className={`
                  text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${product.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}
                `}
                >
                  {product.stock} left
                </span>
              </div>
            ))}
            {productList.length > 8 && (
              <p className="text-[10px] text-center text-primary pt-2 font-bold animate-pulse">
                Click to view full list
              </p>
            )}
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-100" />
        </div>
      )}
    </div>
  );
}
