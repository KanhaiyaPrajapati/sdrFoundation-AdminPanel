import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search services by name, category, or description...",
  delay = 500, // Reduced from 1000ms to 500ms for better UX
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, delay, onChange]);

  return (
    <div className="relative w-full sm:w-64 md:w-72 lg:w-80">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border
        border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-[#4FE7C0] focus:border-transparent
        transition-all duration-200
        hover:border-gray-300 dark:hover:border-gray-600"
        aria-label="Search"
      />
      
      {/* Optional: Clear button (appears when there's text) */}
      {localValue && (
        <button
          onClick={() => {
            setLocalValue("");
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      )}
    </div>
  );
};