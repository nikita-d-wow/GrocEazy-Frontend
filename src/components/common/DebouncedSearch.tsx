import React, { type FC } from 'react';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Input from './Input';

interface DebouncedSearchProps {
  placeholder?: string;
  initialValue?: string;
  onSearch: (value: string) => void;
  delay?: number;
  className?: string;
  showIcon?: boolean;
}

const DebouncedSearch: FC<DebouncedSearchProps> = ({
  placeholder = 'Search...',
  initialValue = '',
  onSearch,
  delay = 300,
  className = '',
  showIcon = true,
}) => {
  const lastEmittedValue = React.useRef(initialValue);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== lastEmittedValue.current) {
        onSearch(value);
        lastEmittedValue.current = value;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onSearch]);

  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        leftIcon={
          showIcon ? <Search className="w-4 h-4 text-gray-400" /> : undefined
        }
      />
    </div>
  );
};

export default DebouncedSearch;
