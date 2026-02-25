import React from "react";
import { X, Mail, Shield } from "lucide-react";
import { Admin } from "../../../../store/api/Admin-api";
import Badge from "../../../ui/badge/Badge";

interface AdminDetailsModalProps {
  admin: Admin;
  onClose: () => void;
}

const AdminDetailsModal: React.FC<AdminDetailsModalProps> = ({
  admin,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
      
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">

        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Admin Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete administrator information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="grid md:grid-cols-3">

          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center text-center">

            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-semibold text-gray-700 dark:text-white mb-4">
              {admin.name?.charAt(0).toUpperCase()}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {admin.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-all">
              {admin.email}
            </p>

            <div className="mt-4">
              <Badge color="info" size="sm">
                {admin.role}
              </Badge>
            </div>
          </div>

          <div className="md:col-span-2 p-8 space-y-8">

            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Basic Information
              </h4>

              <div className="space-y-6">

                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Mail size={18} />
                    <span>Email Address</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white break-all">
                    {admin.email}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Shield size={18} />
                    <span>Role</span>
                  </div>
                  <Badge color="info" size="sm">
                    {admin.role}
                  </Badge>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                  <span className="text-gray-600 dark:text-gray-400">
                    Full Name
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {admin.name}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end px-8 py-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDetailsModal;