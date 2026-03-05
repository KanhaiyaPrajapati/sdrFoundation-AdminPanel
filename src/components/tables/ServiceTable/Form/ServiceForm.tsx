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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    "Other",
  ];

  return (
    <div
      ref={formRef}
      className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />

      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-amber-100 to-emerald-100 dark:from-amber-900/30 dark:to-emerald-900/30 flex items-center justify-center shrink-0">
              {mode === "create" ? (
                <Plus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Edit className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                {mode === "create" ? "Add New Service" : "Edit Service"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === "create"
                  ? "Create a new service"
                  : "Update service details"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 transition-all"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <FileText className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                SERVICE NAME <span className="text-red-500">*</span>
              </p>
            </div>
            <input
              type="text"
              name="service_name"
              value={localData.service_name}
              onChange={handleInputChange}
              placeholder="e.g., Food Distribution"
              className="w-full text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
            <Folder className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                CATEGORY <span className="text-red-500">*</span>
              </p>
            </div>
            <select
              name="category"
              value={localData.category}
              onChange={handleInputChange}
              className="w-full text-xs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none py-0.5 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            >
              <option
                value=""
                className="bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-400"
              >
                Select a category
              </option>
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
            <AlignLeft className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                DESCRIPTION
              </p>
            </div>
            <textarea
              name="description"
              value={localData.description}
              onChange={handleInputChange}
              placeholder="Describe what this service offers..."
              rows={1}
              className="w-full text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:border-purple-500 dark:focus:border-purple-400 outline-none p-1 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shrink-0">
            <Tag className="w-3 h-3 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                STATUS
              </p>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <div>
                <p className="text-xs font-medium text-gray-800 dark:text-white capitalize">
                  {localData.status}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {localData.status === "active"
                    ? "Visible and available"
                    : "Hidden and unavailable"}
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleStatus}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  localData.status === "active"
                    ? "bg-emerald-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                disabled={isSubmitting}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                    localData.status === "active"
                      ? "translate-x-4"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 transition-all duration-200"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleFormSubmit}
          className="px-3 py-1.5 
            bg-linear-to-r from-amber-500 to-orange-500 
            dark:bg-gray-800 dark:from-transparent dark:to-transparent
            hover:from-amber-600 hover:to-orange-600 
            dark:hover:bg-gray-700
            text-white dark:text-gray-200
            text-xs font-medium rounded shadow-sm 
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </button>
      </div>
    </div>
  );
};

export default ServiceForm;
