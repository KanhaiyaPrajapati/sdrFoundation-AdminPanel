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

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            border border-gray-200 dark:border-gray-700
            text-gray-600 dark:text-gray-400
            hover:bg-teal-50 hover:text-teal-600
            dark:hover:bg-teal-900/20 dark:hover:text-teal-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400"
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
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                ${active
                  ? "bg-teal-600 text-white shadow-md hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                  : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20 dark:hover:text-teal-400"
                }`}
            >
              {item}
            </button>
          );
        })}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            border border-gray-200 dark:border-gray-700
            text-gray-600 dark:text-gray-400
            hover:bg-teal-50 hover:text-teal-600
            dark:hover:bg-teal-900/20 dark:hover:text-teal-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;