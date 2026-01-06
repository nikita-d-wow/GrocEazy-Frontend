/**
 * Reusable Skeleton component with shimmer effect
 */
interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

/**
 * Base Skeleton component with shimmer effect
 */
export default function Skeleton({
  className = '',
  variant = 'rect',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200 relative overflow-hidden';

  const variantStyles = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4 w-3/4 mb-2',
  };

  const shimmer = (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  );

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {shimmer}
    </div>
  );
}

/**
 * Reusable Table Row Skeleton
 */
export function TableRowSkeleton({
  cols = 3,
  hasImage = true,
}: {
  cols?: number;
  hasImage?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
      {hasImage && <Skeleton className="h-12 w-12 rounded-xl shrink-0" />}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-lg hidden sm:block" />
      ))}
    </div>
  );
}

/**
 * Reusable Table Skeleton
 */
export function TableSkeleton({
  rows = 5,
  cols = 3,
  hasImage = true,
}: {
  rows?: number;
  cols?: number;
  hasImage?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="p-6 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} cols={cols} hasImage={hasImage} />
        ))}
      </div>
    </div>
  );
}

/**
 * Specialized Inventory Skeleton with Charts
 */
export function InventorySkeleton() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Chart Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[460px]"
          >
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-[380px] w-full rounded-xl" />
          </div>
        ))}
      </div>
      {/* Table Skeleton */}
      <TableSkeleton rows={5} cols={2} />
    </div>
  );
}
