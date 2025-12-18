import type { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const Loader: FC<LoaderProps> = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`${sizes.lg} text-green-600 animate-spin`} />
          <p className="text-gray-500 font-medium animate-pulse">
            Loading amazing things...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className={`${sizes[size]} text-green-600 animate-spin`} />
    </div>
  );
};

export default Loader;
