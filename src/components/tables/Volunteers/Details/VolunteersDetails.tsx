import React, { useRef, useEffect } from "react";
import { User, Calendar, X, Award, Clock } from "lucide-react";
import { Volunteer } from "../../../../store/volunteers-api";
interface VolunteerDetailsProps {
  volunteer: Volunteer;
  onClose: () => void;
}

const VolunteerDetails: React.FC<VolunteerDetailsProps> = ({
  volunteer,
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-gray-500/50">
      <div
        ref={modalRef}
        className="w-full max-w-sm bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        {/* Elegant top bar with subtle gradient */}
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              Volunteer Profile
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] text-gray-500 dark:text-gray-400">
                ID:
              </span>
              <span className="text-[9px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300">
                #
                {volunteer?.user_id
                  ? String(volunteer.user_id).slice(0, 8)
                  : "VOL-001"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          {/* Name Card */}

          {/* Info Sections */}
          <div className="space-y-1.5">
            {/* User ID */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  User ID
                </p>
                <p className="text-xs font-medium text-gray-800 dark:text-white truncate">
                  {volunteer?.user_id || "N/A"}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Skills
                </p>
                <p className="text-xs font-medium text-gray-800 dark:text-white wrap-break-word">
                  {volunteer?.skills || "No skills listed"}
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Availability
                </p>
                <p className="text-xs font-medium text-gray-800 dark:text-white">
                  {volunteer?.availability || "Not specified"}
                </p>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Calendar className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Joined Date
                </p>
                <p className="text-xs font-medium text-gray-800 dark:text-white">
                  {volunteer?.joined_date
                    ? new Date(volunteer.joined_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="pt-2 mt-1 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div>
                <p className="text-gray-400 dark:text-gray-500">Status</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Active Volunteer
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">
                  Registered By
                </p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  System
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[9px] text-gray-500 dark:text-gray-400">
              Volunteer • Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[9px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetails;
