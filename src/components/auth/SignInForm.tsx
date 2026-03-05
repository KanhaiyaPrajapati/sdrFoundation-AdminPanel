// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router";
// // import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
// // import Label from "../form/Label";
// // import Input from "../form/input/InputField";
// // import Button from "../ui/button/Button";
// // import axios, { AxiosError } from "axios";

// // // ---------- Admin Service (inline for single‑file completeness) ----------
// // export interface Admin {
// //   id?: number;
// //   name: string;
// //   email: string;
// //   role: string;
// //   password?: string;
// // }

// // const api = axios.create({
// //   baseURL: "http://192.168.1.20:5000/api/admins",
// //   headers: { "Content-Type": "application/json" },
// // });

// // const handleApiError = (error: unknown, action: string): never => {
// //   const err = error as AxiosError<{ message?: string }>;
// //   const message = err.response?.data?.message || err.message || "Server error";
// //   console.error(`❌ Admin API error while ${action}:`, message);
// //   throw new Error(message);
// // };

// // const adminService = {
// //   async createAdmin(data: Admin): Promise<Admin> {
// //     try {
// //       const res = await api.post("/register", data);
// //       return res.data;
// //     } catch (error) {
// //       return handleApiError(error, "registering admin");
// //     }
// //   },
// // };
// // // -------------------------------------------------------------------------

// // export default function SignUpForm() {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [role, setRole] = useState("admin");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError("");
// //     if (!name || !email || !password) {
// //       setError("All fields are required");
// //       return;
// //     }
// //     setLoading(true);
// //     try {
// //       await adminService.createAdmin({ name, email, password, role });
// //       // Redirect to sign in on success
// //       navigate("/signin");
// //     } catch (err: unknown) {
// //       setError(err instanceof Error ? err.message : "Registration failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col flex-1">
// //       <div className="w-full max-w-md pt-10 mx-auto">
// //         <Link
// //           to="/"
// //           className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
// //         >
// //           <ChevronLeftIcon className="size-5" />
// //           Back to dashboard
// //         </Link>
// //       </div>
// //       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
// //         <div>
// //           <div className="mb-5 sm:mb-8">
// //             <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
// //               Create Admin Account
// //             </h1>
// //             <p className="text-sm text-gray-500 dark:text-gray-400">
// //               Fill in the details to register a new admin
// //             </p>
// //           </div>
// //           <div>
// //             <form onSubmit={handleSubmit}>
// //               {error && (
// //                 <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
// //                   {error}
// //                 </div>
// //               )}
// //               <div className="space-y-6">
// //                 {/* Full Name */}
// //                 <div>
// //                   <Label>
// //                     Full Name <span className="text-error-500">*</span>
// //                   </Label>
// //                   <Input
// //                     placeholder="John Doe"
// //                     value={name}
// //                     onChange={(e) => setName(e.target.value)}
// //                   />
// //                 </div>
// //                 {/* Email */}
// //                 <div>
// //                   <Label>
// //                     Email <span className="text-error-500">*</span>
// //                   </Label>
// //                   <Input
// //                     type="email"
// //                     placeholder="admin@example.com"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                   />
// //                 </div>
// //                 {/* Password */}
// //                 <div>
// //                   <Label>
// //                     Password <span className="text-error-500">*</span>
// //                   </Label>
// //                   <div className="relative">
// //                     <Input
// //                       type={showPassword ? "text" : "password"}
// //                       placeholder="Enter your password"
// //                       value={password}
// //                       onChange={(e) => setPassword(e.target.value)}
// //                     />
// //                     <span
// //                       onClick={() => setShowPassword(!showPassword)}
// //                       className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
// //                     >
// //                       {showPassword ? (
// //                         <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
// //                       ) : (
// //                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
// //                       )}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 {/* Role */}
// //                 <div>
// //                   <Label>
// //                     Role <span className="text-error-500">*</span>
// //                   </Label>
// //                   <select
// //                     value={role}
// //                     onChange={(e) => setRole(e.target.value)}
// //                     className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
// //                   >
// //                     <option value="admin">Admin</option>
// //                     <option value="super_admin">Super Admin</option>
// //                     <option value="manager">Manager</option>
// //                   </select>
// //                 </div>
// //                 <div>
// //                   {/* ✅ Fixed: removed `type` prop, button will default to submit */}
// //                   <Button
// //                     className="w-full"
// //                     size="sm"
// //                     disabled={loading}
// //                   >
// //                     {loading ? "Creating..." : "Register Admin"}
// //                   </Button>
// //                 </div>
// //               </div>
// //             </form>

// //             <div className="mt-5">
// //               <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
// //                 Already have an account?{" "}
// //                 <Link
// //                   to="/signin"
// //                   className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
// //                 >
// //                   Sign In
// //                 </Link>
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }





import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import axios, { AxiosError } from "axios";

// ---------- Admin Service (inline) ----------
export interface Admin {
  id?: number;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface LoginResponse {
  message: string;
  user: Admin;
  token?: string; // if your API returns a token
}

const api = axios.create({
  baseURL: "http://192.168.1.20:5000/api/admins",
  headers: { "Content-Type": "application/json" },
});

const handleApiError = (error: unknown, action: string): never => {
  const err = error as AxiosError<{ message?: string }>;
  const message = err.response?.data?.message || err.message || "Server error";
  console.error(`❌ Admin API error while ${action}:`, message);
  throw new Error(message);
};

const adminService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const res = await api.post("/login", { email, password });
      return res.data;
    } catch (error) {
      return handleApiError(error, "logging in");
    }
  },
};
// --------------------------------------------

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Both email and password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await adminService.login(email, password);
      setSuccess(response.message || "Login successful! Redirecting...");

      // You can store token/user in localStorage/context here if needed
      // localStorage.setItem("token", response.token);

      // Redirect to the admin table page after a short delay
      setTimeout(() => navigate("/Admin-Tables"), 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to home
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Admin Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Password */}
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



