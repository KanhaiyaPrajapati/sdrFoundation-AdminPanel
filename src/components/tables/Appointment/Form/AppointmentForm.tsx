import React, { useEffect, useState, useRef } from "react";
import { X, Calendar, Clock, User, Users, Edit, Plus } from "lucide-react";

interface AppointmentFormProps {
  mode: "create" | "edit";
  formData: {
    user_id: string | number;
    volunteer_id: string | number;
    appointment_date: string;
    appointment_time: string;
    status: "Pending" | "Approved" | "Completed" | "Cancelled" | "Rescheduled";
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
  users?: Array<{ id: string | number; full_name: string }>;
  volunteers?: Array<{ id: string | number; full_name: string; user_id: string | number }>;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  mode,
  formData,
  onChange,
  onSubmit,
  onCancel,
  users = [],
  volunteers = [],
}) => {
  const [localData, setLocalData] = useState(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalData(formData);
    setError(null);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    onChange(e);
    setError(null);
  };

  const handleFormSubmit = async () => {
    // Check if user and volunteer are the same person
    const selectedUser = users.find(u => u.id.toString() === localData.user_id.toString());
    const selectedVolunteer = volunteers.find(v => v.id.toString() === localData.volunteer_id.toString());
    
    if (selectedUser && selectedVolunteer && selectedUser.id.toString() === selectedVolunteer.user_id?.toString()) {
      setError("User and Volunteer cannot be the same person. Please select different individuals.");
      return;
    }

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div 
      ref={formRef}
      className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      {/* Orange gradient top bar - matching Service */}
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />
      
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
                {mode === "create" ? "Schedule New Appointment" : "Edit Appointment"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {mode === "create" 
                  ? "Schedule a new appointment in the system" 
                  : "Update the appointment details"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-3 bg-gray-50 dark:bg-gray-900 max-h-[60vh] overflow-y-auto">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* User Selection */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              SELECT USER <span className="text-red-500">*</span>
            </p>
            <select
              name="user_id"
              value={localData.user_id}
              onChange={handleInputChange}
              className="w-full text-sm bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-1 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            >
              <option value="" className="bg-white dark:bg-gray-800 text-gray-400">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id} className="bg-white dark:bg-gray-800">
                  {user.full_name} (ID: {user.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Volunteer Selection */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              SELECT VOLUNTEER <span className="text-red-500">*</span>
            </p>
            <select
              name="volunteer_id"
              value={localData.volunteer_id}
              onChange={handleInputChange}
              className="w-full text-sm bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-1 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            >
              <option value="" className="bg-white dark:bg-gray-800 text-gray-400">Select a volunteer</option>
              {volunteers.map((volunteer) => (
                <option key={volunteer.id} value={volunteer.id} className="bg-white dark:bg-gray-800">
                  {volunteer.full_name} (ID: {volunteer.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Field */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              APPOINTMENT DATE <span className="text-red-500">*</span>
            </p>
            <input
              type="date"
              name="appointment_date"
              value={localData.appointment_date}
              onChange={handleInputChange}
              min={today}
              className="w-full text-sm bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-1 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Time Field */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              APPOINTMENT TIME <span className="text-red-500">*</span>
            </p>
            <input
              type="time"
              name="appointment_time"
              value={localData.appointment_time}
              onChange={handleInputChange}
              className="w-full text-sm bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-1 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

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
          {isSubmitting ? "Saving..." : (mode === "create" ? "Schedule Appointment" : "Update Appointment")}
        </button>
      </div>
    </div>
  );
};

export default AppointmentForm;