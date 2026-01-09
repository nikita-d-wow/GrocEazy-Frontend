import { type FC, type ReactNode } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import Input from './Input';

interface FilterBarProps {
  id?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  searchComponent?: ReactNode;
  onReset?: () => void;
  showReset?: boolean;
  children?: ReactNode;
}

const FilterBar: FC<FilterBarProps> = ({
  id,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchLabel = 'SEARCH',
  searchComponent,
  onReset,
  showReset,
  children,
}) => {
  return (
    <div
      id={id}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 transition-all duration-300 scroll-mt-24"
    >
      <div className="p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="w-full lg:max-w-md">
          {searchComponent ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 drop-shadow-sm">
                {searchLabel}
              </span>
              {searchComponent}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 w-full">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 drop-shadow-sm">
                {searchLabel}
              </span>
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                leftIcon={<Search className="w-5 h-5 text-gray-400" />}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full lg:w-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:flex xl:items-center gap-3 w-full lg:w-auto">
            {children}
          </div>

          {showReset && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 group whitespace-nowrap lg:mt-5"
              title="Reset all filters"
            >
              <RotateCcw
                size={16}
                className="transition-transform duration-500 group-hover:-rotate-180"
              />
              <span className="sm:hidden lg:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
