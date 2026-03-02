import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center my-3">
      <div className="flex flex-wrap items-center gap-2 text-sm max-w-full">
        {/* Prev Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg dark:text-white border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }

          const active = item === currentPage;

          return (
            <button
              key={`page-${item}`}
              onClick={() => onPageChange(item as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#4FE7C0] text-white dark:bg-[#4FE7C0] dark:text-white shadow-sm"
                  : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              aria-label={`Go to page ${item}`}
              aria-current={active ? "page" : undefined}
            >
              {item}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          className="w-8 h-8 flex items-center justify-center rounded-lg dark:text-white border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="hidden sm:block ml-4 text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;