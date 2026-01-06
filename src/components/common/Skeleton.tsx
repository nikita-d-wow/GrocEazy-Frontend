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

/**
 * Specialized Analytics Dashboard Skeleton
 */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-12 animate-fadeIn max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-32 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-xl" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[450px]"
          >
            <div className="space-y-2 mb-6">
              <Skeleton className="h-6 w-38 rounded-xl" />
              <Skeleton className="h-4 w-52 rounded-lg" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Product Card Skeleton for Analytics
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2.5 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 animate-pulse">
      <div className="w-full aspect-[4/3] rounded-xl bg-gray-200" />
      <div className="space-y-1.5 px-0.5 mt-1">
        <div className="h-2.5 bg-gray-200 rounded-md w-3/4" />
        <div className="flex justify-between items-center">
          <div className="h-2 bg-gray-200 rounded-md w-1/4" />
          <div className="h-3.5 bg-gray-200 rounded-full w-8" />
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 flex gap-1.5">
        <div className="h-6 bg-gray-200 rounded-lg flex-1" />
        <div className="h-6 bg-gray-200 rounded-lg w-7" />
      </div>
    </div>
  );
}
