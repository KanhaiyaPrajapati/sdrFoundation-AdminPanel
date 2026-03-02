import React, { useEffect, useState, useRef } from "react";
import { X, FileText, AlignLeft, Folder, Tag, Edit, Plus } from "lucide-react";

interface ServiceFormProps {
  mode: "create" | "edit";
  formData: {
    service_name: string;
    description: string;
    category: string;
    status: "active" | "inactive";
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onToggleStatus: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  mode,
  formData,
  onChange,
  onToggleStatus,
  onSubmit,
  onCancel,
}) => {
  const [localData, setLocalData] = useState(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalData(formData);
  }, [formData]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onCancel]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    onChange(e);
  };

  const handleFormSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const categories = [
    "Senior Support",
    "Food Security",
    "Education",
    "Healthcare",
    "Language Support",
    "Transportation",
    "Legal Advice",
    "Employment Support",
    "Technology Support",
    "Community Building",
    "Other"
  ];

  return (
    <div 
      ref={formRef}
      className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      {/* Elegant top bar with gradient */}
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />
      
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-amber-100 to-emerald-100 dark:from-amber-900/30 dark:to-emerald-900/30 flex items-center justify-center shrink-0">
              {mode === "create" ? (
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                {mode === "create" ? "Add New Service" : "Edit Service"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {mode === "create" 
                  ? "Create a new service in the system" 
                  : "Update the service details"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-5 space-y-3 bg-gray-50 dark:bg-gray-900 max-h-[60vh] overflow-y-auto">
        {/* Service Name Field */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                SERVICE NAME <span className="text-red-500">*</span>
              </p>
            </div>
            <input
              type="text"
              name="service_name"
              value={localData.service_name}
              onChange={handleInputChange}
              placeholder="e.g., Food Distribution, Computer Training"
              className="w-full text-sm bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-1 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
            <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                CATEGORY <span className="text-red-500">*</span>
              </p>
            </div>
            <select
              name="category"
              value={localData.category}
              onChange={handleInputChange}
              className="w-full text-sm bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none py-1 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            >
              <option value="" className="bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Field */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
            <AlignLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                DESCRIPTION
              </p>
            </div>
            <textarea
              name="description"
              value={localData.description}
              onChange={handleInputChange}
              placeholder="Describe what this service offers..."
              rows={2}
              className="w-full text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 outline-none p-2 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Status Field */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shrink-0">
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                STATUS
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                  {localData.status}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {localData.status === "active" 
                    ? "Service will be visible and available" 
                    : "Service will be hidden and unavailable"}
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleStatus}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-gray-900 ${
                  localData.status === "active" 
                    ? "bg-emerald-500" 
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                disabled={isSubmitting}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    localData.status === "active" 
                      ? "translate-x-5" 
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with action buttons - FIXED: Submit button now has primary styling */}
      <div className="px-4 sm:px-5 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleFormSubmit}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : (mode === "create" ? "Create Service" : "Update Service")}
        </button>
      </div>
    </div>
  );
};

export default ServiceForm;