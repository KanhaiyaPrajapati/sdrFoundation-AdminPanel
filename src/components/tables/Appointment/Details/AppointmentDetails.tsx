import React, { useRef, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Users,
  Hash,
  X,
  Mail,
  Award,
} from "lucide-react";

interface AppointmentDetailsProps {
  appointment: {
    id?: string | number;
    user_id: string | number;
    volunteer_id: string | number;
    appointment_date: string;
    appointment_time: string;
    status: "Pending" | "Approved" | "Completed" | "Cancelled" | "Rescheduled";
    created_at?: string;
    user_name?: string;
    user_email?: string;
    user_phone?: string;
    volunteer_name?: string;
    volunteer_skills?: string;
  };
  onClose: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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

  const formatAppointmentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "Pending":
        return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
      case "Completed":
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "Cancelled":
        return "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800";
      case "Rescheduled":
        return "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div
      ref={modalRef}
      className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />

      <div className="px-4 py-3 bg-white dark:bg-[#1F2937] border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-amber-100 to-emerald-100 dark:from-amber-900/30 dark:to-emerald-900/30 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                Appointment Details
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                View appointment information
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
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <Hash className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              APPOINTMENT ID & STATUS
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-800 dark:text-white">
                #{appointment.id?.toString().slice(0, 8) || "APT-001"}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(appointment.status)}`}
              >
                {appointment.status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              DATE & TIME
            </p>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                <p className="text-xs font-medium text-gray-800 dark:text-white">
                  {formatAppointmentDate(appointment.appointment_date)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                <p className="text-xs font-medium text-gray-800 dark:text-white">
                  {formatTime(appointment.appointment_time)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
            <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              USER INFORMATION
            </p>
            <p className="text-xs font-medium text-gray-800 dark:text-white">
              {appointment.user_name || `User ID: ${appointment.user_id}`}
            </p>
            {appointment.user_email && (
              <div className="flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                <p className="text-[10px] text-gray-600 dark:text-gray-400">
                  {appointment.user_email}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
            <Users className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              VOLUNTEER INFORMATION
            </p>
            <p className="text-xs font-medium text-gray-800 dark:text-white">
              {appointment.volunteer_name ||
                `Volunteer ID: ${appointment.volunteer_id}`}
            </p>
            {appointment.volunteer_skills && (
              <div className="flex items-start gap-1 mt-0.5">
                <Award className="w-3 h-3 text-gray-400 dark:text-gray-500 mt-0.5" />
                <p className="text-[10px] text-gray-600 dark:text-gray-400">
                  {appointment.volunteer_skills}
                </p>
              </div>
            )}
          </div>
        </div>

        {appointment?.created_at && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shrink-0">
              <Calendar className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                CREATED DATE
              </p>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(appointment.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-white dark:bg-[#1F2937] border-t border-gray-200 dark:border-gray-800 flex items-center justify-end">
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetails;