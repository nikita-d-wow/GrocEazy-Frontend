import React, { useState } from 'react';
import { optimizeCloudinaryUrl, type ImageSize } from '../../utils/imageUtils';
import Skeleton from './Skeleton';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  size?: ImageSize;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  containerClassName?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  size = 'medium',
  width,
  height,
  className = '',
  loading = 'lazy',
  fallbackSrc,
  containerClassName = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(!src);

  const optimizedSrc = optimizeCloudinaryUrl(src, { size, width, height });
  const finalFallback =
    fallbackSrc ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`;

  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
    setError(!src);
  }

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ width, height }}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-[inherit]" />
        </div>
      )}

      <img
        src={error ? finalFallback : optimizedSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        width={width}
        height={height}
      />
    </div>
  );
};

export default OptimizedImage;
