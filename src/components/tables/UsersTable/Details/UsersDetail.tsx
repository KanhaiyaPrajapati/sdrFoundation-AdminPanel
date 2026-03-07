
import React from "react";
import {
  User as UserIcon,
  Mail,
  UserCog,
  Calendar,
  Clock,
  Hash,
  Tag,
  Phone,
  X,
} from "lucide-react";
import { User } from "../../../../store/types/Users.types";

interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isActive = user?.status?.toLowerCase() === "active";

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Elegant top bar */}
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />

      {/* Header */}
      <div className="px-4 py-3 bg-white dark:bg-[#1F2937] border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-amber-100 to-emerald-100 dark:from-amber-900/30 dark:to-emerald-900/30 flex items-center justify-center shrink-0">
              <Hash className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                User Details
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                View user information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 bg-gray-50 dark:bg-[#1F2937] max-h-[70vh] overflow-y-auto">
        {/* User ID and Status */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <Tag className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              USER ID & STATUS
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-800 dark:text-white">
                #{user.id?.toString().slice(0, 8) || "USR-001"}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200"
                }`}
              >
                {isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <UserIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              FULL NAME
            </p>
            <p className="text-xs font-medium text-gray-800 dark:text-white truncate">
              {user?.full_name || "N/A"}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
            <Mail className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              EMAIL ADDRESS
            </p>
            <p className="text-xs font-medium text-gray-800 dark:text-white break-all">
              {user?.email || "N/A"}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
            <Phone className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              PHONE NUMBER
            </p>
            <p className="text-xs font-medium text-gray-800 dark:text-white">
              {user?.phone || "Not provided"}
            </p>
          </div>
        </div>

        {/* User Type */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 flex items-center justify-center shrink-0">
            <UserCog className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              USER TYPE
            </p>
            <p className="text-xs font-medium text-gray-800 dark:text-white capitalize">
              {user?.user_type || "Not assigned"}
            </p>
          </div>
        </div>

        {/* Created Date */}
        {user?.created_at && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center shrink-0">
              <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                REGISTRATION DATE
              </p>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-white dark:bg-[#1F2937] border-t border-gray-200 dark:border-gray-800 flex items-center justify-end">
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDetails;