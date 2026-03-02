import React, { useRef, useEffect } from "react";
import { FileText, AlignLeft, Folder, Calendar, Clock, Tag, Hash, X } from "lucide-react";

interface ServiceDetailsProps {
  service: {
    id?: string | number;
    service_name: string;
    description: string;
    category: string;
    status: "active" | "inactive";
    created_at?: string;
  };
  onClose: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      ref={modalRef}
      className="w-full bg-white dark:bg-[#1F2937] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      {/* Elegant top bar with subtle gradient */}
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />
      
      {/* Header - Matching ServiceForm exactly */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white dark:bg-[#1F2937] border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-amber-100 to-emerald-100 dark:from-amber-900/30 dark:to-emerald-900/30 flex items-center justify-center shrink-0">
              <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                Service Details
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                View service information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content - Matching ServiceForm background exactly */}
      <div className="p-4 sm:p-5 space-y-3 bg-gray-50 dark:bg-[#1F2937] max-h-[60vh] overflow-y-auto">
        {/* Service ID and Status */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              SERVICE ID & STATUS
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                #{service.id?.toString().slice(0, 8) || "SRD-001"}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                service?.status === 'active' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
              }`}>
                {service?.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Service Name */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              SERVICE NAME
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white wrap-break-word">
              {service?.service_name || "N/A"}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
            <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              CATEGORY
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {service?.category || "N/A"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
            <AlignLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              DESCRIPTION
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 wrap-break-word leading-relaxed">
              {service?.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Created Date */}
        {service?.created_at && (
          <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                CREATED DATE & TIME
              </p>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 wrap-break-word">
                  {formatDate(service.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Matching ServiceForm exactly */}
      <div className="px-4 sm:px-5 py-3 bg-white dark:bg-[#1F2937] border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2 sm:gap-3">
        <button
          onClick={onClose}
          className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ServiceDetails;