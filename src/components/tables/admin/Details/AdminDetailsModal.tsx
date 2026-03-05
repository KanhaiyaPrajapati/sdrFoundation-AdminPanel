import React, { useRef, useEffect } from "react";
import { X, Mail, Shield, Fingerprint, Lock, User, Hash } from "lucide-react";
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

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
      case "super administrator":
        return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      default:
        return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

        <div className="px-4 py-3 bg-white dark:bg-[#1F2937] border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center shrink-0">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                  Admin Profile
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  User Account Information
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

        <div className="p-4 space-y-2 bg-gray-50 dark:bg-[#1F2937] max-h-[70vh] overflow-y-auto">
          
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center shrink-0">
              <Hash className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                ADMIN ID & ROLE
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-800 dark:text-white">
                  #{admin.id?.toString().padStart(4, '0') || "N/A"}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getRoleColor(admin.role)}`}>
                  {admin.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

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

          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center shrink-0">
              <Mail className="w-3 h-3 text-orange-600 dark:text-orange-400" />
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

          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
              <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                SECURITY STATUS
              </p>
              <div className="flex items-center gap-1">
                <Fingerprint className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Verified Account Access
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-white dark:bg-[#1F2937] border-t border-gray-200 dark:border-gray-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsModal;