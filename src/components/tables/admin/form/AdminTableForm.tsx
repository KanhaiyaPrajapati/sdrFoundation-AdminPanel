import React, { useState, useEffect, useRef } from "react";
import { X, Shield, User, Mail, Lock, Plus, Edit } from "lucide-react";
import { Admin } from "../../../../store/api/Admin-api";

interface AdminTableFormProps {
  onClose: () => void;
  adminData?: Admin;
  onSubmit: (adminData: Admin) => Promise<void>;
  isLoading?: boolean;
}

const AdminTableForm: React.FC<AdminTableFormProps> = ({
  onClose,
  adminData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Admin>({
    name: "",
    email: "",
    role: "Admin",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name || "",
        email: adminData.email || "",
        role: adminData.role || "Admin",
        password: adminData.password || "",
      });
    }
  }, [adminData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node) && !isLocked) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLocked) onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose, isLoading, isSubmitting]);

  const isLocked = isSubmitting || isLoading;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleFormSubmit = async () => {
    setFormError(null);
    if (!formData.name.trim()) return setFormError("Full name is required");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return setFormError("Invalid email format");
    
    if (!adminData && (!formData.password || formData.password.length < 6)) {
      return setFormError("Password must be at least 6 characters");
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
      <div
        ref={formRef}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        {/* Top Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500" />

        {/* Header */}
        <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-100 to-emerald-100 dark:from-amber-900/30 dark:to-emerald-900/30 flex items-center justify-center shrink-0">
                {adminData ? (
                  <Edit className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                  {adminData ? "Update Admin" : "Add New Admin"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {adminData ? "Modify account access" : "Register a new administrator"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 transition-all"
              disabled={isLocked}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
          {formError && (
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{formError}</p>
            </div>
          )}

          {/* Full Name Field */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
              <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                FULL NAME <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className="w-full text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                disabled={isLocked}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center shrink-0">
              <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                EMAIL ADDRESS <span className="text-red-500">*</span>
              </p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                disabled={isLocked}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
              <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                {adminData ? "NEW PASSWORD (OPTIONAL)" : "PASSWORD *"}
              </p>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                disabled={isLocked}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
              <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                ACCESS LEVEL <span className="text-red-500">*</span>
              </p>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white"
                disabled={isLocked}
                required
              >
                <option value="Admin" className="dark:bg-gray-900">Standard Admin</option>
                <option value="Super Admin" className="dark:bg-gray-900">Super Admin</option>
                <option value="Moderator" className="dark:bg-gray-900">Moderator</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 transition-all duration-200"
            disabled={isLocked}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-medium rounded shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLocked}
          >
            {isLocked ? "Saving..." : adminData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTableForm;