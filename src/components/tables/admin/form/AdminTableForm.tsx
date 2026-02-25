import React, { useState, useEffect } from "react";
import { X, Loader2, Shield, User, Mail, Lock } from "lucide-react";
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
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<Admin>({
    name: "",
    email: "",
    role: "Admin",
    password: ""
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name || "",
        email: adminData.email || "",
        role: adminData.role || "Admin",
        password: adminData.password || "" 
      });
    }
  }, [adminData]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLocked) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      if (!formData.name.trim()) throw new Error("Full name is required");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) throw new Error("Invalid email format");
      if (!adminData && (!formData.password || formData.password.length < 6)) {
        throw new Error("Password must be at least 6 characters");
      }
      
      await onSubmit(formData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | React.SelectHTMLAttributes<HTMLSelectElement>>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const isLocked = isSubmitting || isLoading;

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-opacity cursor-pointer overflow-y-auto"
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col cursor-default my-auto border border-gray-100 dark:border-gray-800 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 sm:px-8 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 shrink-0 rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {adminData ? "Update Admin" : "Create New Admin"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full"
            disabled={isLocked}
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <form id="admin-form" onSubmit={handleSubmit}>
            {formError && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                <span className="shrink-0 h-2 w-2 rounded-full bg-red-500" />
                {formError}
              </div>
            )}

            <div className="space-y-4 sm:space-y-5">
              <div className="group">
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <User size={16} className="text-gray-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white placeholder:text-gray-400 outline-none"
                  placeholder="John Doe"
                  disabled={isLocked}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white placeholder:text-gray-400 outline-none"
                  placeholder="john@company.com"
                  disabled={isLocked}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Lock size={16} className="text-gray-400" />
                  {adminData ? "Update Password (Optional)" : "Initial Password"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white outline-none"
                  placeholder="••••••••"
                  disabled={isLocked}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Shield size={16} className="text-gray-400" />
                  Access Level
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange as any}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white appearance-none cursor-pointer outline-none"
                    disabled={isLocked}
                  >
                    <option value="Admin">Standard Admin</option>
                    <option value="Super Admin">Super Admin (Root)</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 sm:px-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 shrink-0">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              disabled={isLocked}
            >
              Discard
            </button>
            <button
              form="admin-form" 
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg min-w-[160px]"
              disabled={isLocked}
            >
              {isLocked ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <span>{adminData ? "Save Changes" : "Create Account"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTableForm;