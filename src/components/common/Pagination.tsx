import type { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void | Promise<void>;
  className?: string;
  isLoading?: boolean;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  isLoading = false,
}) => {
  const handlePageChange = (page: number) => {
    if (isLoading || page < 1 || page > totalPages) {
      return;
    }

    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return pages;
    }

    if (currentPage <= 4) {
      return [...pages.slice(0, 5), '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
        className="
          p-2 rounded-lg border border-gray-200
          text-primary hover:bg-primary/10
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors
        "
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            disabled={isLoading}
            className={`
              min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all
              ${
                currentPage === page
                  ? 'bg-primary text-white shadow-md'
                  : 'border border-gray-200 text-gray-700 hover:bg-primary/10 hover:text-primary'
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
        className="
          p-2 rounded-lg border border-gray-200
          text-primary hover:bg-primary/10
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors
        "
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
