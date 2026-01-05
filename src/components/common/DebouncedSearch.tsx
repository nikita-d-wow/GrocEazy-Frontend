import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Input from './Input';

interface DebouncedSearchProps {
  placeholder?: string;
  initialValue?: string;
  onSearch: (_value: string) => void;
  delay?: number;
  className?: string;
}

const DebouncedSearch: FC<DebouncedSearchProps> = ({
  placeholder = 'Search...',
  initialValue = '',
  onSearch,
  delay = 300,
  className = '',
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onSearch]);

  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        leftIcon={<Search className="w-5 h-5 text-gray-400" />}
      />
    </div>
  );
};

export default DebouncedSearch;
