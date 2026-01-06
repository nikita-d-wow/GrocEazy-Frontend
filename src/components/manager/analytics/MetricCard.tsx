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
        relative group overflow-visible p-6 rounded-3xl
        bg-white/40 backdrop-blur-xl border border-white/40
        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
        hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
        hover:scale-[1.02] hover:-translate-y-1
        transition-all duration-500 ease-out
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Decorative Gradient Background */}
      <div
        className={`absolute inset-0 opacity-[0.08] group-hover:opacity-[0.12] bg-gradient-to-br ${bg} rounded-3xl transition-opacity duration-500`}
      />

      <div className="relative flex items-center justify-between z-10">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {value}
            </h3>
            {onClick && (
              <span className="text-[10px] font-bold text-primary/80 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                View Details →
              </span>
            )}
          </div>
        </div>

        <div
          className={`
            p-4 rounded-2xl
            bg-gradient-to-br ${bg}
            text-white shadow-lg shadow-current/20
            group-hover:scale-110 group-hover:rotate-3
            transition-all duration-500 ease-out
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
            bg-white/95 backdrop-blur-2xl border border-gray-100
            rounded-3xl shadow-2xl p-5
            transition-all duration-500 transform translate-y-4 group-hover:translate-y-0
            pointer-events-none
          "
        >
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100/50">
            <div
              className={`p-1.5 rounded-lg bg-gradient-to-br ${bg} bg-opacity-10`}
            >
              <PackageSearch size={16} className="text-white" />
            </div>
            <span className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
              Quick Preview
            </span>
            <span className="ml-auto bg-gray-100/50 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {productList.length} items
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-2.5">
            {productList.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-xs text-gray-700 truncate font-semibold">
                  {product.name}
                </span>
                <span
                  className={`
                  text-[10px] font-black px-2 py-1 rounded-lg
                  ${
                    product.stock === 0
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-amber-50 text-amber-600'
                  }
                `}
                >
                  {product.stock}
                </span>
              </div>
            ))}
            {productList.length > 8 && (
              <p className="text-[11px] text-center text-primary pt-3 font-bold animate-pulse">
                Click for complete inventory list • {productList.length - 8}{' '}
                more
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-100" />
        </div>
      )}
    </div>
  );
}
