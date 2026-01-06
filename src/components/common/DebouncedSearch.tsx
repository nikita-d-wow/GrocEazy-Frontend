import React, { type FC, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import Input from './Input';

interface DebouncedSearchProps {
  placeholder?: string;
  initialValue?: string;
  onSearch: (value: string) => void;
  delay?: number;
  className?: string;
}

const DebouncedSearch: FC<DebouncedSearchProps> = ({
  placeholder = 'Search...',
  initialValue = '',
  onSearch,
  delay = 300,
  className = '', }) => {
  const [value, setValue] = useState(initialValue);
  const timeoutRef = useRef<number | null>(null);
  const lastEmittedValue = useRef(initialValue);

  // Sync with parent's initialValue ONLY if it's not what we just emitted
  useEffect(() => {
    if (initialValue !== lastEmittedValue.current) {
      setValue(initialValue);
      lastEmittedValue.current = initialValue;
    }
  }, [initialValue]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onSearch(newValue);
      lastEmittedValue.current = newValue;
    }, delay);
  };

  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        leftIcon={<Search className="w-5 h-5 text-gray-400" />}
      />
    </div>
  );
};

export default DebouncedSearch;
