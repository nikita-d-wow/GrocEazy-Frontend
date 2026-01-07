import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Filter, Search, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterSelectProps {
  label: string;
  options: Option[];
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  className?: string;
  align?: 'left' | 'right';
  searchable?: boolean;
}

const FilterSelect = ({
  label,
  options,
  value,
  onChange,
  className = '',
  align = 'left',
  searchable = false,
}: FilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchTerm) {
      return options;
    }
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest ml-1 drop-shadow-sm">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-between gap-3 px-4 py-2.5
            bg-card border-2 border-border
            rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30
            transition-all duration-300 group min-w-[160px] cursor-pointer
            ${isOpen ? 'ring-4 ring-primary/10 border-primary/50' : ''}
          `}
        >
          <div className="flex items-center gap-2.5">
            <Filter
              size={16}
              className={`transition-colors ${isOpen ? 'text-primary' : 'text-muted-text group-hover:text-primary'}`}
            />
            <span className="text-sm font-bold text-text whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
              {selectedOption ? selectedOption.label : 'Select...'}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-muted-text transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-3 z-[999]
              w-full min-w-[220px] p-2
              bg-card border-2 border-border
              rounded-2xl shadow-xl
              flex flex-col gap-1 max-h-[400px]
            `}
          >
            {searchable && (
              <div className="relative mb-2 px-1 pt-1">
                <Search className="absolute left-4 top-4 w-4 h-4 text-muted-text" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-muted border-2 border-transparent focus:border-primary-light rounded-xl text-sm outline-none transition-all text-text"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
              </div>
            )}

            <div className="overflow-y-auto custom-scrollbar flex flex-col gap-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`
                        w-full flex items-center justify-between
                        px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                        ${
                          isSelected
                            ? 'bg-primary-light text-primary'
                            : 'text-muted-text hover:bg-muted hover:text-text cursor-pointer'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        {option.icon && (
                          <span
                            className={
                              isSelected ? 'text-primary' : 'text-muted-text'
                            }
                          >
                            {option.icon}
                          </span>
                        )}
                        {option.label}
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <Check size={16} className="text-primary" />
                        </motion.div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-sm text-muted-text text-center">
                  No matches found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterSelect;
