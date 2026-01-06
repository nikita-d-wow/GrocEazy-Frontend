import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Filter } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  align?: 'left' | 'right';
}

const FilterSelect = ({
  label,
  options,
  value,
  onChange,
  className = '',
  align = 'left',
}: FilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 drop-shadow-sm">
          {label}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-between gap-3 px-4 py-2.5
            bg-white border-2 border-gray-100
            rounded-2xl shadow-sm hover:shadow-md hover:border-green-500/30
            transition-all duration-300 group min-w-[160px] cursor-pointer
            ${isOpen ? 'ring-4 ring-green-500/10 border-green-500/50' : ''}
          `}
        >
          <div className="flex items-center gap-2.5">
            <Filter
              size={16}
              className={`transition-colors ${isOpen ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`}
            />
            <span className="text-sm font-bold text-gray-700 whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
              {selectedOption ? selectedOption.label : 'Select...'}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-green-600' : ''
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
              bg-white border-2 border-gray-100
              rounded-2xl shadow-2xl shadow-gray-200/50
              flex flex-col gap-1
            `}
          >
            {options.length > 0 ? (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer'
                    }
                  `}
                  >
                    <div className="flex items-center gap-2.5">
                      {option.icon && (
                        <span
                          className={
                            isSelected ? 'text-green-600' : 'text-gray-400'
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
                        <Check size={16} className="text-green-600" />
                      </motion.div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                No options available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterSelect;
