
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search by User ID, Skills, or Availability...",
  delay = 500,
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
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-linear-to-r from-amber-500 via-orange-300 to-emerald-500 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-[2px]"></div>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-500 dark:text-gray-500 dark:group-hover:text-amber-400 transition-colors duration-200">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-64 pl-10 pr-8 py-2 text-sm rounded-lg border
            border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-amber-500/20
            focus:border-amber-300 dark:focus:border-amber-700
            transition-all duration-200
            relative z-10"
        />
        {localValue && (
          <button
            onClick={() => setLocalValue("")}
            className="absolute right-2 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-amber-500
              dark:text-gray-500 dark:hover:text-amber-400
              transition-colors duration-200
              z-20"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};