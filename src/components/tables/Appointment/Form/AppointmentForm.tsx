import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Users,
  Edit,
  Plus,
  Check,
} from "lucide-react";
import { User as UserType } from "../../../../store/user-api";
import { Volunteer as VolunteerType } from "../../../../store/volunteer-api";

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
  users?: UserType[];
  volunteers?: VolunteerType[];
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

  const selectedUser = users.find(
    (u) => u.id.toString() === localData.user_id?.toString(),
  );
  const selectedVolunteer = volunteers.find(
    (v) => v.id.toString() === localData.volunteer_id?.toString(),
  );

  useEffect(() => {
    setLocalData(formData);
    setError(null);
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    onChange(e);
    setError(null);
  };

  const handleFormSubmit = async () => {
    if (
      selectedUser &&
      selectedVolunteer &&
      selectedUser.id.toString() === selectedVolunteer.user_id?.toString()
    ) {
      setError("User and Volunteer cannot be the same person");
      return;
    }
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "Failed to save appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
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
                {mode === "create"
                  ? "Schedule Appointment"
                  : "Edit Appointment"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === "create"
                  ? "Schedule a new appointment"
                  : "Update appointment details"}
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
        {error && (
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
            <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                SELECT USER <span className="text-red-500">*</span>
              </p>
              {selectedUser && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check size={10} /> Selected
                </span>
              )}
            </div>
            <select
              name="user_id"
              value={localData.user_id}
              onChange={handleInputChange}
              className="w-full text-xs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} - {user.user_type || 'User'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
            <Users className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                SELECT VOLUNTEER <span className="text-red-500">*</span>
              </p>
              {selectedVolunteer && (
                <span className="text-[10px] text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Check size={10} /> Selected
                </span>
              )}
            </div>
            <select
              name="volunteer_id"
              value={localData.volunteer_id}
              onChange={handleInputChange}
              className="w-full text-xs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a volunteer</option>
              {volunteers.map((volunteer) => (
                <option key={volunteer.id} value={volunteer.id}>
                  {volunteer.full_name} 
                  {volunteer.skills ? ` - ${volunteer.skills.substring(0, 30)}...` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                APPOINTMENT DATE <span className="text-red-500">*</span>
              </p>
            </div>
            <input
              type="date"
              name="appointment_date"
              value={localData.appointment_date}
              onChange={handleInputChange}
              min={today}
              className="w-full text-xs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center shrink-0">
            <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                APPOINTMENT TIME <span className="text-red-500">*</span>
              </p>
            </div>
            <input
              type="time"
              name="appointment_time"
              value={localData.appointment_time}
              onChange={handleInputChange}
              className="w-full text-xs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {mode === "edit" && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shrink-0">
              <Users className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                STATUS
              </p>
              <select
                name="status"
                value={localData.status}
                onChange={handleInputChange}
                className="w-full text-xs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white"
                disabled={isSubmitting}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>
        )}

        {(selectedUser || selectedVolunteer) && (
          <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
            <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 mb-1">
              Appointment Summary
            </p>
            <div className="space-y-0.5">
              {selectedUser && (
                <p className="text-[10px] text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    User:
                  </span>{" "}
                  {selectedUser.full_name}
                </p>
              )}
              {selectedVolunteer && (
                <p className="text-[10px] text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Volunteer:
                  </span>{" "}
                  {selectedVolunteer.full_name}
                </p>
              )}
            </div>
          </div>
        )}
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
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Schedule"
              : "Update"}
        </button>
      </div>
    </div>
  );
};

export default AppointmentForm;