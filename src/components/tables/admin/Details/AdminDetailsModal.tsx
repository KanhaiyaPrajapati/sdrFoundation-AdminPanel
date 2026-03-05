import React, { useRef, useEffect } from "react";
import { X, Mail, Shield, User, Hash, Info } from "lucide-react";
import { Admin } from "../../../../store/api/Admin-api";

interface AdminDetailsModalProps {
  admin: Admin;
  onClose: () => void;
}

const AdminDetailsModal: React.FC<AdminDetailsModalProps> = ({ admin, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "Admin":
        return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
      default:
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        {/* Top Gradient Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500" />
        
        {/* Header */}
        <div className="px-4 py-3 bg-white dark:bg-[#1F2937] border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-100 to-emerald-100 dark:from-amber-900/30 dark:to-emerald-900/30 flex items-center justify-center shrink-0">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                  Admin Details
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full administrator profile information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2 bg-gray-50 dark:bg-[#1F2937] max-h-[70vh] overflow-y-auto">
          
          {/* Admin ID & Role Row */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
              <Hash className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                ADMIN ROLE & ACCESS
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getRoleBadgeColor(admin.role)}`}>
                  {admin.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Full Name Row */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
              <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                FULL NAME
              </p>
              <p className="text-xs font-medium text-gray-800 dark:text-white">
                {admin.name || "N/A"}
              </p>
            </div>
          </div>

          {/* Email Row */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center shrink-0">
              <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                EMAIL ADDRESS
              </p>
              <p className="text-xs font-medium text-gray-800 dark:text-white break-words">
                {admin.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Permissions/Shield Row */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
              <Shield className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                SECURITY STATUS
              </p>
              <p className="text-xs font-medium text-gray-800 dark:text-white">
                Active Administrator Account
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-white dark:bg-[#1F2937] border-t border-gray-200 dark:border-gray-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsModal;