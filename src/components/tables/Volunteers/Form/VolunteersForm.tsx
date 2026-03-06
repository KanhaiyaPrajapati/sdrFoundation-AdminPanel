import { Volunteer } from "../../../../store/volunteers-api";
import { AlertCircle } from "lucide-react";
import React from "react";

interface VolunteerFormProps {
  mode: "create" | "view" | "edit";
  formData: Volunteer;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    > | { target: { name: string; value: any } }
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isCheckingUser?: boolean;
  userError?: string | null;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({
  mode,
  formData,
  onChange,
  onSubmit,
  onCancel,
  isCheckingUser = false,
  userError = null,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
   
    onChange({
      target: {
        name: 'user_id',
        value: String(value) 
      }
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden w-full max-w-md">
      
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />
      
      <div className="p-4">
    
        <div className="mb-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            {isCreateMode
              ? "Add Volunteer"
              : isViewMode
              ? "Volunteer Details"
              : "Edit Volunteer"}
          </h2>
          <div className="flex items-center gap-2 mt-1">
        
            <span className="text-[9px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300">
              {isCreateMode ? "" : isViewMode ? "VIEW" : "EDIT"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              User ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="user_id"
                disabled={isViewMode}
                value={String(formData.user_id || '')} 
                onChange={handleUserIdChange} 
                required
                className={`w-full rounded-lg p-2.5 text-xs transition-all outline-none border
                  ${userError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-amber-300 dark:focus:border-amber-700'
                  }
                  bg-white dark:bg-gray-800
                  text-gray-800 dark:text-white
                  disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 dark:disabled:text-gray-400
                  focus:ring-1 focus:ring-amber-500/20`}
                placeholder="Enter user ID"
                inputMode="numeric" 
                pattern="[0-9]*" 
              />
              {isCheckingUser && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            
            
            {userError && (
              <div className="flex items-center gap-1.5 mt-1 text-[9px] text-red-600 dark:text-red-400">
                <AlertCircle size={12} />
                <span>{userError}</span>
              </div>
            )}
            
            <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">
              Enter a valid User ID that exists in the system
            </p>
          </div>

          
          <div className="space-y-1.5">
            <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Skills <span className="text-red-500">*</span>
            </label>
            <textarea
              name="skills"
              disabled={isViewMode}
              value={formData.skills || ''}
              onChange={onChange}
              rows={1}
              required
              className="w-full rounded-lg p-2.5 text-xs transition-all outline-none resize-none border
                bg-white dark:bg-gray-800
                border-gray-200 dark:border-gray-700
                text-gray-800 dark:text-white
                disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 dark:disabled:text-gray-400
                focus:border-amber-300 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-500/20"
              placeholder="Enter skills (comma separated)"
            />
          </div>

          
          <div className="space-y-1.5">
            <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Availability <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="availability"
              disabled={isViewMode}
              value={formData.availability || ''}
              onChange={onChange}
              required
              className="w-full rounded-lg p-2.5 text-xs transition-all outline-none border
                bg-white dark:bg-gray-800
                border-gray-200 dark:border-gray-700
                text-gray-800 dark:text-white
                disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 dark:disabled:text-gray-400
                focus:border-amber-300 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-500/20"
              placeholder="e.g., Weekends, Weekdays, Evenings"
            />
          </div>

          {/* Joined Date Field */}
          <div className="space-y-1.5">
            <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Joined Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="joined_date"
              disabled={isViewMode}
              value={formData.joined_date || ''}
              onChange={onChange}
              required
              className="w-full rounded-lg p-2.5 text-xs transition-all outline-none border
                bg-white dark:bg-gray-800
                border-gray-200 dark:border-gray-700
                text-gray-800 dark:text-white
                disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 dark:disabled:text-gray-400
                focus:border-amber-300 dark:focus:border-amber-700 focus:ring-1 focus:ring-amber-500/20
                scheme-light-dark"
            />
          </div>

          {/* Action Buttons */}
          {!isViewMode && (
            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[9px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCheckingUser || !!userError}
                className={`px-4 py-1.5 text-[9px] font-medium rounded-lg border transition-all duration-200
                  ${isCheckingUser || userError
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow'
                  }`}
              >
                {isCheckingUser ? 'Checking...' : isCreateMode ? 'Create Volunteer' : 'Update Volunteer'}
              </button>
            </div>
          )}

          {/* View Mode Footer */}
          {isViewMode && (
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] text-gray-500 dark:text-gray-400">View Only • Read Only</span>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[9px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow transition-all duration-200"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VolunteerForm;


