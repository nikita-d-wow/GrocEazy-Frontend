import { type FC, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import Input from './Input';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  children?: ReactNode;
}

const FilterBar: FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchLabel = 'Search',
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 transition-all duration-300">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex-1 max-w-md w-full">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
              {searchLabel}
            </span>
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          {children && (
            <div className="flex flex-wrap md:flex-nowrap gap-4 justify-end">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
