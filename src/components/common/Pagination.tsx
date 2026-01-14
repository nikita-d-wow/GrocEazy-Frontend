import React, { type FC, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void | Promise<void>;
  className?: string;
  isLoading?: boolean;
  scrollTargetId?: string;
  showPageNumbersOnMobile?: boolean;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  isLoading = false,
  scrollTargetId,
  showPageNumbersOnMobile = false,
}) => {
  const isFirstRender = React.useRef(true);

  const scrollToTop = useCallback(() => {
    // Immediate scroll (auto) feels faster for paginated data
    setTimeout(() => {
      if (scrollTargetId) {
        const element = document.getElementById(scrollTargetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 50);
  }, [scrollTargetId]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToTop();
  }, [currentPage, scrollToTop]);

  const handlePageChange = (page: number) => {
    if (isLoading || page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
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
    <div
      className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
    >
      {/* Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
        className="
          p-2 sm:p-2.5 rounded-xl border border-gray-100 bg-white
          text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer
        "
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Page Numbers */}
      <div
        className={`${showPageNumbersOnMobile ? 'flex' : 'hidden sm:flex'} items-center gap-2`}
      >
        {pageNumbers.map((page, idx) =>
          page === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-gray-300 font-bold self-end pb-1"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              disabled={isLoading}
              className={`
                min-w-[38px] h-[38px] sm:min-w-[42px] sm:h-[42px] px-2 rounded-xl font-bold transition-all duration-300
                ${
                  currentPage === page
                    ? 'bg-[#bbf7d0] text-green-900 shadow-sm scale-105 sm:scale-110 border border-green-200'
                    : 'bg-white border border-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-100'
                }
                disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer
              `}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Mobile Indicator */}
      {!showPageNumbersOnMobile && (
        <div className="flex sm:hidden items-center px-2 text-sm font-bold text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      )}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
        className="
          p-2 sm:p-2.5 rounded-xl border border-gray-100 bg-white
          text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer
        "
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default Pagination;
