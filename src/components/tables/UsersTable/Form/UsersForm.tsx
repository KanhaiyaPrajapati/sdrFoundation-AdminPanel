// import React from "react";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import {
//   User as UserIcon,
//   Mail,
//   Phone,
//   UserCog,
//   Tag,
//   Edit,
//   Plus,
//   X,
// } from "lucide-react";
// import { User } from "../../../../store/types/Users.types";

// interface UserFormProps {
//   mode: "create" | "edit";
//   initialData: Omit<User, "id" | "created_at">;
//   onSubmit: (values: Omit<User, "id" | "created_at">) => void;
//   onCancel: () => void;
// }

// // Validation schema
// const validationSchema = yup.object({
//   full_name: yup.string().required("Full name is required"),
//   email: yup.string().email("Invalid email format").required("Email is required"),
//   phone: yup
//     .string()
//     .required("Phone number is required")
//     .test("len", "Phone must be exactly 10 digits", (val) => /^\d{10}$/.test(val)),
//   user_type: yup.string().required("User type is required"),
//   status: yup.string().required("Status is required"),
// });

// const UserForm: React.FC<UserFormProps> = ({
//   mode,
//   initialData,
//   onSubmit,
//   onCancel,
// }) => {
//   const formik = useFormik({
//     initialValues: initialData,
//     validationSchema,
//     onSubmit: (values) => {
//       onSubmit(values);
//     },
//     enableReinitialize: true,
//     validateOnChange: true,
//     validateOnBlur: true,
//   });

//   // Phone input handler: allow only digits, max 10 characters
//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
//     formik.setFieldValue("phone", digits);
//   };

//   return (
//     <form
//       onSubmit={formik.handleSubmit}
//       className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
//     >
//       {/* Top gradient bar */}
//       <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />

//       {/* Header with close button */}
//       <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-100 to-emerald-100 dark:from-amber-900/30 dark:to-emerald-900/30 flex items-center justify-center shrink-0">
//             {mode === "create" ? (
//               <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
//             ) : (
//               <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
//             )}
//           </div>
//           <div>
//             <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
//               {mode === "create" ? "Add New User" : "Edit User"}
//             </h2>
//             <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
//               {mode === "create" ? "Create a new user" : "Update user details"}
//             </p>
//           </div>
//         </div>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
//           aria-label="Close"
//         >
//           <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
//         </button>
//       </div>

//       {/* Scrollable content (scrollbar hidden) */}
//       <div
//         className="p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-gray-950/50 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto scrollbar-hide"
//         style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//       >
//         <style>{`
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//         `}</style>

//         {/* Full name */}
//         <div className="flex gap-3 p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-sm">
//           <UserIcon className="w-4 h-4 mt-1 text-amber-500 dark:text-amber-400 shrink-0" />
//           <div className="flex-1">
//             <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//               Full Name <span className="text-red-500">*</span>
//             </p>
//             <input
//               type="text"
//               name="full_name"
//               placeholder="Enter full name"
//               value={formik.values.full_name}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full border-b border-gray-200 dark:border-gray-700 bg-transparent outline-none py-1 text-sm text-gray-700 dark:text-gray-200 focus:border-amber-500 transition-colors"
//             />
//             {formik.touched.full_name && formik.errors.full_name && (
//               <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
//                 {formik.errors.full_name}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Email */}
//         <div className="flex gap-3 p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-sm">
//           <Mail className="w-4 h-4 mt-1 text-emerald-500 dark:text-emerald-400 shrink-0" />
//           <div className="flex-1">
//             <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//               Email Address <span className="text-red-500">*</span>
//             </p>
//             <input
//               type="email"
//               name="email"
//               placeholder="user@example.com"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full border-b border-gray-200 dark:border-gray-700 bg-transparent outline-none py-1 text-sm text-gray-700 dark:text-gray-200 focus:border-emerald-500 transition-colors"
//             />
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
//                 {formik.errors.email}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Phone */}
//         <div className="flex gap-3 p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-sm">
//           <Phone className="w-4 h-4 mt-1 text-orange-500 dark:text-orange-400 shrink-0" />
//           <div className="flex-1">
//             <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//               Phone (10 digits) <span className="text-red-500">*</span>
//             </p>
//             <input
//               type="text"
//               name="phone"
//               maxLength={10}
//               placeholder="9876543210"
//               value={formik.values.phone}
//               onChange={handlePhoneChange}
//               onBlur={formik.handleBlur}
//               inputMode="numeric"
//               pattern="[0-9]*"
//               className="w-full border-b border-gray-200 dark:border-gray-700 bg-transparent outline-none py-1 text-sm font-mono text-gray-700 dark:text-gray-200 focus:border-orange-500 transition-colors"
//             />
//             {formik.touched.phone && formik.errors.phone && (
//               <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
//                 {formik.errors.phone}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Two‑column row */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* User type    */}
//           <div className="flex gap-3 p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-sm">
//             <UserCog className="w-4 h-4 mt-1 text-blue-500 dark:text-blue-400 shrink-0" />
//             <div className="flex-1">
//               <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//                 Role <span className="text-red-500">*</span>
//               </p>
//               <select
//                 name="user_type"
//                 value={formik.values.user_type}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="w-full border-b border-gray-200 dark:border-gray-700 bg-transparent outline-none py-1 text-sm text-gray-700 dark:text-gray-200 cursor-pointer focus:border-blue-500"
//               >
//                 <option value="" className="dark:bg-gray-900">
//                   Select
//                 </option>
//                 <option value="newcomer" className="dark:bg-gray-900">
//                   Newcomer
//                 </option>
//                 <option value="senior" className="dark:bg-gray-900">
//                   Senior
//                 </option>
//                 <option value="volunteer" className="dark:bg-gray-900">
//                   Volunteer
//                 </option>
//               </select>
//               {formik.touched.user_type && formik.errors.user_type && (
//                 <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
//                   {formik.errors.user_type}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Status */}
//           <div className="flex gap-3 p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-sm">
//             <Tag className="w-4 h-4 mt-1 text-purple-500 dark:text-purple-400 shrink-0" />
//             <div className="flex-1">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//                     Status
//                   </p>
//                   <p
//                     className={`text-xs font-bold capitalize mt-1 ${
//                       formik.values.status === "active"
//                         ? "text-emerald-500"
//                         : "text-gray-500 dark:text-gray-400"
//                     }`}
//                   >
//                     {formik.values.status}
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     formik.setFieldValue(
//                       "status",
//                       formik.values.status === "active" ? "inactive" : "active"
//                     )
//                   }
//                   className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
//                     formik.values.status === "active"
//                       ? "bg-emerald-500"
//                       : "bg-gray-300 dark:bg-gray-600"
//                   }`}
//                   aria-label="Toggle status"
//                 >
//                   <span className="sr-only">Toggle status</span>
//                   <div
//                     className={`absolute top-1 bg-white w-3 h-3 rounded-full transition-all duration-200 ${
//                       formik.values.status === "active" ? "left-6" : "left-1"
//                     }`}
//                   />
//                 </button>
//               </div>
//               {formik.touched.status && formik.errors.status && (
//                 <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
//                   {formik.errors.status}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row justify-end gap-3 bg-white dark:bg-gray-900">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white uppercase tracking-widest bg-gray-900 dark:bg-amber-600 rounded-lg hover:bg-black dark:hover:bg-amber-700 transition-all shadow-lg active:scale-95"
//         >
//           {mode === "create" ? "Create User" : "Save Changes"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default UserForm;




import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  User as UserIcon,
  Mail,
  Phone,
  UserCog,
  Tag,
  Edit,
  Plus,
  X,
} from "lucide-react";
import { User } from "../../../../store/types/Users.types";

interface UserFormProps {
  mode: "create" | "edit";
  initialData: Omit<User, "id" | "created_at">;
  onSubmit: (values: Omit<User, "id" | "created_at">) => void;
  onCancel: () => void;
}

// Validation schema
const validationSchema = yup.object({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test("len", "Phone must be exactly 10 digits", (val) => /^\d{10}$/.test(val)),
  user_type: yup.string().required("User type is required"),
  status: yup.string().required("Status is required"),
});

const UserForm: React.FC<UserFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Handle click outside and escape key
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

  const formik = useFormik({
    initialValues: initialData,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setTimeout(() => setIsSubmitting(false), 500);
      }
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Phone input handler: allow only digits, max 10 characters
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    formik.setFieldValue("phone", digits);
  };

  const userTypes = ["newcomer", "senior", "volunteer"];

  return (
    <div
      ref={formRef}
      className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      {/* Elegant top bar */}
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-emerald-500" />

      {/* Header */}
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
                {mode === "create" ? "Add New User" : "Edit User"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === "create"
                  ? "Create a new user"
                  : "Update user details"}
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

      {/* Form Content – exactly as ServiceForm */}
      <div className="p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
        {/* Full Name */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center shrink-0">
            <UserIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                FULL NAME <span className="text-red-500">*</span>
              </p>
            </div>
            <input
              type="text"
              name="full_name"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter full name"
              className="w-full text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 outline-none py-0.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isSubmitting}
            />
            {formik.touched.full_name && formik.errors.full_name && (
              <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
                {formik.errors.full_name}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center shrink-0">
            <Mail className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                EMAIL ADDRESS <span className="text-red-500">*</span>
              </p>
            </div>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="user@example.com"
              className="w-full text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none py-0.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isSubmitting}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
                {formik.errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center shrink-0">
            <Phone className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                PHONE NUMBER <span className="text-red-500">*</span>
              </p>
            </div>
            <input
              type="text"
              name="phone"
              value={formik.values.phone}
              onChange={handlePhoneChange}
              onBlur={formik.handleBlur}
              placeholder="9876543210"
              maxLength={10}
              inputMode="numeric"
              className="w-full text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 outline-none py-0.5 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isSubmitting}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
                {formik.errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* User Type (select) */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 flex items-center justify-center shrink-0">
            <UserCog className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                USER TYPE <span className="text-red-500">*</span>
              </p>
            </div>
            <select
              name="user_type"
              value={formik.values.user_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full text-xs bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none py-0.5 text-gray-800 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="" className="bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-400">
                Select a role
              </option>
              {userTypes.map((type) => (
                <option key={type} value={type} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {formik.touched.user_type && formik.errors.user_type && (
              <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
                {formik.errors.user_type}
              </p>
            )}
          </div>
        </div>

        {/* Status with toggle */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shrink-0">
            <Tag className="w-3 h-3 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                STATUS
              </p>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <div>
                <p className="text-xs font-medium text-gray-800 dark:text-white capitalize">
                  {formik.values.status}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {formik.values.status === "active"
                    ? "User can log in and access the system"
                    : "User cannot log in"}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  formik.setFieldValue(
                    "status",
                    formik.values.status === "active" ? "inactive" : "active"
                  )
                }
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                  formik.values.status === "active"
                    ? "bg-emerald-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                disabled={isSubmitting}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                    formik.values.status === "active"
                      ? "translate-x-4"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            {formik.touched.status && formik.errors.status && (
              <p className="text-red-500 text-[10px] mt-1 uppercase font-medium">
                {formik.errors.status}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
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
          onClick={() => formik.handleSubmit()}
          className="px-3 py-1.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-medium rounded shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : (mode === "create" ? "Create" : "Update")}
        </button>
      </div>
    </div>
  );
};

export default UserForm;


