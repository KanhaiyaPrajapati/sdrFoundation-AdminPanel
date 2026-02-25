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
    <div className="flex items-center justify-center my-3">
      <div className="flex flex-wrap items-center gap-2 text-sm max-w-full">
        {/* Prev Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full dark:text-white border border-gray-300 dark:border-white/20 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/10"
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={index}
                className="px-2 py-1 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }

          const active = item === currentPage;

          return (
            <button
              key={index}
              onClick={() => onPageChange(item as number)}
              className={`w-7 h-7 flex items-center justify-center rounded-full border text-sm transition ${
                active
                  ? "bg-[#465fff] text-white dark:bg-white dark:text-black"
                  : "border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
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
          className="w-7 h-7 flex items-center justify-center rounded-full dark:text-white border border-gray-300 dark:border-white/20 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/10"
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
