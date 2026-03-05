// // import React, { useEffect, useState, useCallback, useMemo } from "react";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHeader,
// //   TableRow,
// // } from "../../ui/table";
// // import { Modal } from "../../ui/modal";
// // import Badge from "../../ui/badge/Badge";
// // import Alert from "../../ui/alert/Alert";
// // import Button from "../../ui/button/Button";
// // import { Trash2, Eye, Edit, Plus } from "lucide-react";
// // import Pagination from "../../ui/pagination/Pagination";   // ✅ changed to lowercase
// // import Loader from "../../ui/loader/Loader";               // ✅ changed to lowercase
// // import { SearchBar } from "../../../hooks/SearchBar";
// // import {
// //   fetchAllUsers,
// //   addUser,
// //   updateUser,
// //   deleteUser,
// // } from "../../../store/api/Users-api";
// // import { User } from "../../../store/types/Users.types";
// // import UserForm from "./Form/UsersForm";
// // import UserDetails from "./Details/UsersDetail";

// // const truncateText = (text?: string, limit: number = 20) => {
// //   if (!text) return "";
// //   return text.length > limit ? text.slice(0, limit) + "..." : text;
// // };

// // const formatDate = (dateString: string): string => {
// //   if (!dateString) return "";
// //   const date = new Date(dateString);
// //   return date.toLocaleDateString(undefined, {
// //     year: "numeric",
// //     month: "short",
// //     day: "numeric",
// //   });
// // };

// // const UserTableOne: React.FC = () => {
// //   const [users, setUsers] = useState<User[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// //   const [currentUser, setCurrentUser] = useState<User | null>(null);
// //   const [mode, setMode] = useState<"create" | "edit" | "view">("create");
// //   const [initialFormData, setInitialFormData] = useState<Omit<User, "id" | "created_at">>({
// //     full_name: "",
// //     email: "",
// //     phone: "",
// //     user_type: "",
// //     status: "active",
// //   });
// //   const [alert, setAlert] = useState<{
// //     type: "success" | "error";
// //     message: string;
// //   } | null>(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const itemsPerPage = 5;
// //   const [searchTerm, setSearchTerm] = useState("");

// //   const showAlert = useCallback(
// //     (alertData: { type: "success" | "error"; message: string }) => {
// //       setAlert(alertData);
// //       setTimeout(() => setAlert(null), 3500);
// //     },
// //     []
// //   );

// //   const loadUsers = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       const timer = new Promise((resolve) => setTimeout(resolve, 800));
// //       const apiCall = fetchAllUsers();
// //       const [, result] = await Promise.all([timer, apiCall]);

// //       let usersArray: User[] = [];

// //       if (Array.isArray(result)) {
// //         usersArray = result;
// //       } else if (result && typeof result === "object") {
// //         if (Array.isArray(result.users)) {
// //           usersArray = result.users;
// //         } else if (Array.isArray(result.data)) {
// //           usersArray = result.data;
// //         } else if (Array.isArray(result.items)) {
// //           usersArray = result.items;
// //         } else {
// //           console.warn("Unexpected API response format:", result);
// //         }
// //       }

// //       const sanitizedUsers = usersArray
// //         .map((user) => ({
// //           id: typeof user.id === 'number' ? user.id : Number(user.id),
// //           full_name: user.full_name ?? "",
// //           email: user.email ?? "",
// //           phone: user.phone ?? "",
// //           user_type: user.user_type ?? "",
// //           status: user.status ?? "active",
// //           created_at: user.created_at ?? new Date().toISOString(),
// //         }))
// //         .filter((user) => !isNaN(user.id));

// //       setUsers(sanitizedUsers);
// //     } catch (error) {
// //       showAlert({
// //         type: "error",
// //         message: error instanceof Error ? error.message : "Failed to load users",
// //       });
// //       setUsers([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [showAlert]);

// //   useEffect(() => {
// //     loadUsers();
// //   }, [loadUsers]);

// //   const openModal = useCallback(
// //     (type: "create" | "edit" | "view", user?: User) => {
// //       setMode(type);
// //       if (user) {
// //         setCurrentUser(user);
// //         if (type === "edit") {
// //           // eslint-disable-next-line @typescript-eslint/no-unused-vars
// //           const { id, created_at, ...rest } = user;
// //           setInitialFormData(rest);
// //         }
// //       } else {
// //         setCurrentUser(null);
// //         setInitialFormData({
// //           full_name: "",
// //           email: "",
// //           phone: "",
// //           user_type: "",
// //           status: "active",
// //         });
// //       }
// //       setIsModalOpen(true);
// //     },
// //     []
// //   );

// //   const closeModal = useCallback(() => {
// //     setIsModalOpen(false);
// //     setCurrentUser(null);
// //   }, []);

// //   const extractUserFromResponse = (response: unknown): User | null => {
// //     if (!response || typeof response !== 'object') return null;

// //     const isUserObject = (obj: unknown): obj is Record<string, unknown> => {
// //       return obj !== null && typeof obj === 'object' && 'id' in obj;
// //     };

// //     let candidate: unknown = response;

// //     if ('user' in response) {
// //       candidate = (response as { user: unknown }).user;
// //     } else if ('data' in response) {
// //       candidate = (response as { data: unknown }).data;
// //     }

// //     if (!isUserObject(candidate)) return null;

// //     const id = Number(candidate.id);
// //     if (isNaN(id)) {
// //       console.error('Invalid id received from API:', candidate.id);
// //       return null;
// //     }

// //     return {
// //       id,
// //       full_name: candidate.full_name ? String(candidate.full_name) : '',
// //       email: candidate.email ? String(candidate.email) : '',
// //       phone: candidate.phone ? String(candidate.phone) : '',
// //       user_type: candidate.user_type ? String(candidate.user_type) : '',
// //       status: candidate.status ? String(candidate.status) : 'active',
// //       created_at: candidate.created_at ? String(candidate.created_at) : new Date().toISOString(),
// //     };
// //   };

// //   const handleFormSubmit = useCallback(
// //     async (values: Omit<User, "id" | "created_at">) => {
// //       try {
// //         if (mode === "create") {
// //           const response = await addUser(values);
// //           const newUser = extractUserFromResponse(response);
// //           if (!newUser) {
// //             throw new Error("Invalid response from server: missing user data");
// //           }
// //           showAlert({ type: "success", message: "User added successfully" });
// //           setUsers((prev) => [...prev, newUser]);
// //         } else if (mode === "edit" && currentUser?.id) {
// //           const response = await updateUser(currentUser.id, values);
// //           const updatedUser = extractUserFromResponse(response);
// //           if (!updatedUser) {
// //             const patchedUser: User = {
// //               ...currentUser,
// //               ...values,
// //             };
// //             setUsers((prev) =>
// //               prev.map((user) =>
// //                 user.id === currentUser.id ? patchedUser : user
// //               )
// //             );
// //           } else {
// //             setUsers((prev) =>
// //               prev.map((user) =>
// //                 user.id === currentUser.id ? updatedUser : user
// //               )
// //             );
// //           }
// //           showAlert({ type: "success", message: "User updated successfully" });
// //         }
// //         closeModal();
// //       } catch (error) {
// //         console.error("Submit error:", error);
// //         showAlert({
// //           type: "error",
// //           message: error instanceof Error ? error.message : "Operation failed",
// //         });
// //         closeModal();
// //       }
// //     },
// //     [mode, currentUser, showAlert, closeModal]
// //   );

// //   const openDeleteModal = useCallback((user: User) => {
// //     setCurrentUser(user);
// //     setIsDeleteModalOpen(true);
// //   }, []);

// //   const handleDeleteConfirm = useCallback(async () => {
// //     if (!currentUser?.id) return;
// //     try {
// //       await deleteUser(currentUser.id);
// //       showAlert({ type: "success", message: "User deleted successfully" });
// //       setUsers((prev) => {
// //         const newUsers = prev.filter((user) => user.id !== currentUser.id);
// //         const filteredAfterDelete = newUsers.filter(
// //           (u) =>
// //             u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //             u.email.toLowerCase().includes(searchTerm.toLowerCase())
// //         );
// //         const totalPages = Math.max(
// //           1,
// //           Math.ceil(filteredAfterDelete.length / itemsPerPage)
// //         );
// //         if (currentPage > totalPages && totalPages > 0) {
// //           setTimeout(() => setCurrentPage(totalPages), 0);
// //         }
// //         return newUsers;
// //       });
// //     } catch (error) {
// //       showAlert({
// //         type: "error",
// //         message: error instanceof Error ? error.message : "Delete failed",
// //       });
// //     } finally {
// //       setIsDeleteModalOpen(false);
// //       setCurrentUser(null);
// //     }
// //   }, [currentUser, showAlert, searchTerm, currentPage, itemsPerPage]);

// //   const filterUsers = useCallback(
// //     (usersArray: User[]) => {
// //       if (!searchTerm.trim()) return usersArray;
// //       const term = searchTerm.toLowerCase();
// //       return usersArray.filter(
// //         (u) =>
// //           u.full_name.toLowerCase().includes(term) ||
// //           u.email.toLowerCase().includes(term)
// //       );
// //     },
// //     [searchTerm]
// //   );

// //   const filteredUsers = useMemo(() => {
// //     const safeUsers = Array.isArray(users) ? users : [];
// //     return filterUsers(safeUsers);
// //   }, [users, filterUsers]);

// //   const totalPages = useMemo(() => {
// //     return Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
// //   }, [filteredUsers.length, itemsPerPage]);

// //   const paginatedUsers = useMemo(() => {
// //     const startIndex = (currentPage - 1) * itemsPerPage;
// //     return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
// //   }, [filteredUsers, currentPage, itemsPerPage]);

// //   const handleSearchChange = useCallback((value: string) => {
// //     setSearchTerm(value);
// //     setCurrentPage(1);
// //   }, []);

// //   const handlePageChange = useCallback((page: number) => {
// //     setCurrentPage(page);
// //   }, []);

// //   useEffect(() => {
// //     if (currentPage > totalPages && totalPages > 0) {
// //       setCurrentPage(totalPages);
// //     }
// //   }, [totalPages, currentPage]);

// //   const getStatusColor = (
// //     status: string
// //   ): "success" | "error" | "warning" | "info" => {
// //     switch (status.toLowerCase()) {
// //       case "active":
// //         return "success";
// //       case "inactive":
// //         return "error";
// //       case "pending":
// //         return "warning";
// //       default:
// //         return "info";
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-[90vh] w-full">
// //         <Loader />
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
// //         <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-5 py-4 gap-3">
// //           <button
// //             onClick={() => openModal("create")}
// //             className="inline-flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 p-2 text-[#4FE7C0] dark:text-[#4FE7C0] hover:bg-[#4FE7C0]/10 dark:hover:bg-[#4FE7C0]/20 w-full sm:w-auto border border-gray-200 dark:border-gray-700 transition-colors"
// //             aria-label="Add new user"
// //           >
// //             <Plus size={20} className="mr-2 sm:mr-0" />
// //             <span className="sm:sr-only">Add New</span>
// //           </button>
// //           <div className="w-full sm:w-auto">
// //             <SearchBar value={searchTerm} onChange={handleSearchChange} />
// //           </div>
// //         </div>

// //         <div className="w-full overflow-x-auto">
// //           <div className="min-w-0">
// //             <Table className="w-full">
// //               <TableHeader className="border-b border-gray-100 dark:border-gray-800">
// //                 <TableRow>
// //                   <TableCell
// //                     isHeader
// //                     className="px-3 sm:px-4 py-3 font-medium text-gray-500 text-start text-xs sm:text-theme-xs dark:text-gray-400 w-[15%]"
// //                   >
// //                     Name
// //                   </TableCell>
// //                   <TableCell
// //                     isHeader
// //                     className="px-3 sm:px-4 py-3 font-medium text-gray-500 text-start text-xs sm:text-theme-xs dark:text-gray-400 w-[20%]"
// //                   >
// //                     Email
// //                   </TableCell>
// //                   <TableCell
// //                     isHeader
// //                     className="px-3 sm:px-4 py-3 font-medium text-gray-500 text-start text-xs sm:text-theme-xs dark:text-gray-400 w-[12%]"
// //                   >
// //                     Phone
// //                   </TableCell>
// //                   <TableCell
// //                     isHeader
// //                     className="px-3 sm:px-4 py-3 font-medium text-gray-500 text-start text-xs sm:text-theme-xs dark:text-gray-400 w-[10%]"
// //                   >
// //                     User Type
// //                   </TableCell>
// //                   <TableCell
// //                     isHeader
// //                     className="px-3 sm:px-4 py-3 font-medium text-gray-500 text-start text-xs sm:text-theme-xs dark:text-gray-400 w-[10%]"
// //                   >
// //                     Status
// //                   </TableCell>
// //                   <TableCell
// //                     isHeader
// //                     className="px-3 sm:px-4 py-3 font-medium text-gray-500 text-start text-xs sm:text-theme-xs dark:text-gray-400 w-[12%]"
// //                   >
// //                     Created At
// //                   </TableCell>
// //                   <TableCell
// //                     isHeader
// //                     className="px-3 sm:px-4 py-3 font-medium text-gray-500 text-start text-xs sm:text-theme-xs dark:text-gray-400 w-[15%]"
// //                   >
// //                     Actions
// //                   </TableCell>
// //                 </TableRow>
// //               </TableHeader>

// //               <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
// //                 {paginatedUsers.length > 0 ? (
// //                   paginatedUsers.map((user) => (
// //                     <TableRow
// //                       key={user.id}
// //                       className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
// //                     >
// //                       <TableCell className="px-3 sm:px-4 py-3 text-start align-top">
// //                         <span className="font-medium text-gray-800 text-sm sm:text-theme-sm dark:text-gray-200 line-clamp-2">
// //                           {truncateText(user.full_name, 20)}
// //                         </span>
// //                       </TableCell>
// //                       <TableCell className="px-3 sm:px-4 py-3 text-start align-top">
// //                         <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-theme-sm line-clamp-2">
// //                           {truncateText(user.email, 25)}
// //                         </span>
// //                       </TableCell>
// //                       <TableCell className="px-3 sm:px-4 py-3 text-start align-top">
// //                         <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
// //                           {user.phone || "-"}
// //                         </span>
// //                       </TableCell>
// //                       <TableCell className="px-3 sm:px-4 py-3 text-start align-top">
// //                         <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm capitalize">
// //                           {user.user_type || "-"}
// //                         </span>
// //                       </TableCell>
// //                       <TableCell className="px-3 sm:px-4 py-3 text-start align-top whitespace-nowrap">
// //                         <Badge
// //                           size="sm"
// //                           color={getStatusColor(user.status)}
// //                           variant="light"
// //                         >
// //                           {user.status}
// //                         </Badge>
// //                       </TableCell>
// //                       <TableCell className="px-3 sm:px-4 py-3 text-start align-top">
// //                         <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
// //                           {formatDate(user.created_at)}
// //                         </span>
// //                       </TableCell>
// //                       <TableCell className="px-2 sm:px-4 py-3 align-top">
// //                         <div className="flex items-center justify-start gap-1">
// //                           <button
// //                             onClick={() => openModal("view", user)}
// //                             className="p-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
// //                             title="View"
// //                             aria-label={`View ${user.full_name}`}
// //                           >
// //                             <Eye size={16} />
// //                           </button>
// //                           <button
// //                             onClick={() => openModal("edit", user)}
// //                             className="p-1.5 text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 rounded-full hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
// //                             title="Edit"
// //                             aria-label={`Edit ${user.full_name}`}
// //                           >
// //                             <Edit size={16} />
// //                           </button>
// //                           <button
// //                             onClick={() => openDeleteModal(user)}
// //                             className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
// //                             title="Delete"
// //                             aria-label={`Delete ${user.full_name}`}
// //                           >
// //                             <Trash2 size={16} />
// //                           </button>
// //                         </div>
// //                       </TableCell>
// //                     </TableRow>
// //                   ))
// //                 ) : (
// //                   <TableRow>
// //                     <TableCell
              
// //                       className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
// //                     >
// //                       <div className="text-sm sm:text-base">
// //                         No users found {searchTerm ? `for "${searchTerm}"` : ""}
// //                       </div>
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </div>
// //         </div>

// //         {totalPages > 1 && (
// //           <div className="px-3 sm:px-4 py-3 border-t border-gray-100 dark:border-gray-800">
// //             <Pagination
// //               currentPage={currentPage}
// //               totalPages={totalPages}
// //               onPageChange={handlePageChange}
// //             />
// //           </div>
// //         )}
// //       </div>

// //       {/* Unified Modal for Create/Edit/View */}
// //       {isModalOpen && (
// //         <Modal
// //           isOpen={isModalOpen}
// //           onClose={closeModal}
// //           className="max-w-lg w-[95vw] mx-auto"
// //         >
// //           <div className="bg-white dark:bg-[#1F2937] rounded-3xl overflow-hidden">
// //             {mode === "view" && currentUser && (
// //               <UserDetails user={currentUser} onClose={closeModal} />
// //             )}
// //             {(mode === "create" || mode === "edit") && (
// //               <UserForm
// //                 mode={mode}
// //                 initialData={initialFormData}
// //                 onSubmit={handleFormSubmit}
// //                 onCancel={closeModal}
// //               />
// //             )}
// //           </div>
// //         </Modal>
// //       )}

// //       {/* Delete Modal */}
// //       {isDeleteModalOpen && currentUser && (
// //         <Modal
// //           isOpen={isDeleteModalOpen}
// //           onClose={() => setIsDeleteModalOpen(false)}
// //           className="max-w-md w-[95vw] mx-auto"
// //         >
// //           <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6">
// //             <h3 className="text-lg font-semibold text-gray-900 dark:text-[#4FE7C0] mb-2">
// //               Delete User
// //             </h3>
// //             <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
// //               Are you sure you want to delete{" "}
// //               <span className="font-medium text-gray-900 dark:text-white">
// //                 {currentUser.full_name}
// //               </span>
// //               ? This action cannot be undone.
// //             </p>
// //             <div className="flex flex-col sm:flex-row justify-end gap-3">
// //               <Button
// //                 variant="outline"
// //                 onClick={() => setIsDeleteModalOpen(false)}
// //                 className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#374151] dark:bg-transparent"
// //               >
// //                 Cancel
// //               </Button>
// //               <Button
// //                 variant="primary"
// //                 onClick={handleDeleteConfirm}
// //                 className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
// //               >
// //                 Delete
// //               </Button>
// //             </div>
// //           </div>
// //         </Modal>
// //       )}

// //       {alert && (
// //         <div className="fixed bottom-5 right-2 z-50 w-[calc(100vw-1rem)] sm:w-72 max-w-sm">
// //           <Alert
// //             variant={alert.type}
// //             title={alert.type === "success" ? "Success" : "Error"}
// //             message={alert.message}
// //           />
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default UserTableOne;




// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import {
//   Table,
//   TableBody,
//  TableCell,
//   TableHeader,
//   TableRow,
// } from "../../ui/table";
// import { Modal } from "../../ui/modal";
// import Badge from "../../ui/badge/Badge";
// import Alert from "../../ui/alert/Alert";
// import { Trash2, Eye, Edit, Plus } from "lucide-react";
// import Pagination from "../../ui/pagination/Pagination";
// import { SearchBar } from "../../../hooks/SearchBar";
// import {
//   fetchAllUsers,
//   addUser,
//   updateUser,
//   deleteUser,
// } from "../../../store/api/Users-api";
// import { User } from "../../../store/types/Users.types";
// import UserForm from "./Form/UsersForm";
// import UserDetails from "./Details/UsersDetail";

// const truncateText = (text?: string, limit: number = 20) => {
//   if (!text) return "";
//   return text.length > limit ? text.slice(0, limit) + "..." : text;
// };

// const formatDate = (dateString: string): string => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   return date.toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// const UserTableOne: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [mode, setMode] = useState<"create" | "edit" | "view">("create");
//   const [initialFormData, setInitialFormData] = useState<Omit<User, "id" | "created_at">>({
//     full_name: "",
//     email: "",
//     phone: "",
//     user_type: "",
//     status: "active",
//   });
//   const [alert, setAlert] = useState<{
//     type: "success" | "error" | "warning" | "info";
//     title: string;
//     message: string;
//   } | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const [searchTerm, setSearchTerm] = useState("");

//   const showAlert = useCallback(
//     (alertData: { type: "success" | "error" | "warning" | "info"; title: string; message: string }) => {
//       setAlert(alertData);
//       setTimeout(() => setAlert(null), 3000);
//     },
//     []
//   );

//   const loadUsers = useCallback(async () => {
//     try {
//       setLoading(true);
//       const timer = new Promise((resolve) => setTimeout(resolve, 800));
//       const apiCall = fetchAllUsers();
//       const [, result] = await Promise.all([timer, apiCall]);

//       let usersArray: User[] = [];

//       if (Array.isArray(result)) {
//         usersArray = result;
//       } else if (result && typeof result === "object") {
//         if (Array.isArray(result.users)) {
//           usersArray = result.users;
//         } else if (Array.isArray(result.data)) {
//           usersArray = result.data;
//         } else if (Array.isArray(result.items)) {
//           usersArray = result.items;
//         } else {
//           console.warn("Unexpected API response format:", result);
//         }
//       }

//       const sanitizedUsers = usersArray
//         .map((user) => ({
//           id: typeof user.id === 'number' ? user.id : Number(user.id),
//           full_name: user.full_name ?? "",
//           email: user.email ?? "",
//           phone: user.phone ?? "",
//           user_type: user.user_type ?? "",
//           status: user.status ?? "active",
//           created_at: user.created_at ?? new Date().toISOString(),
//         }))
//         .filter((user) => !isNaN(user.id));

//       setUsers(sanitizedUsers);
//     } catch (error) {
//       showAlert({
//         type: "error",
//         title: "Error",
//         message: error instanceof Error ? error.message : "Failed to load users",
//       });
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [showAlert]);

//   useEffect(() => {
//     loadUsers();
//   }, [loadUsers]);

//   const openModal = useCallback(
//     (type: "create" | "edit" | "view", user?: User) => {
//       setMode(type);
//       if (user) {
//         setCurrentUser(user);
//         if (type === "edit") {
//           // eslint-disable-next-line @typescript-eslint/no-unused-vars
//           const { id, created_at, ...rest } = user;
//           setInitialFormData(rest);
//         }
//       } else {
//         setCurrentUser(null);
//         setInitialFormData({
//           full_name: "",
//           email: "",
//           phone: "",
//           user_type: "",
//           status: "active",
//         });
//       }
//       setIsModalOpen(true);
//     },
//     []
//   );

//   const closeModal = useCallback(() => {
//     setIsModalOpen(false);
//     setCurrentUser(null);
//   }, []);

//   const extractUserFromResponse = (response: unknown): User | null => {
//     if (!response || typeof response !== 'object') return null;

//     const isUserObject = (obj: unknown): obj is Record<string, unknown> => {
//       return obj !== null && typeof obj === 'object' && 'id' in obj;
//     };

//     let candidate: unknown = response;

//     if ('user' in response) {
//       candidate = (response as { user: unknown }).user;
//     } else if ('data' in response) {
//       candidate = (response as { data: unknown }).data;
//     }

//     if (!isUserObject(candidate)) return null;

//     const id = Number(candidate.id);
//     if (isNaN(id)) {
//       console.error('Invalid id received from API:', candidate.id);
//       return null;
//     }

//     return {
//       id,
//       full_name: candidate.full_name ? String(candidate.full_name) : '',
//       email: candidate.email ? String(candidate.email) : '',
//       phone: candidate.phone ? String(candidate.phone) : '',
//       user_type: candidate.user_type ? String(candidate.user_type) : '',
//       status: candidate.status ? String(candidate.status) : 'active',
//       created_at: candidate.created_at ? String(candidate.created_at) : new Date().toISOString(),
//     };
//   };

//   const handleFormSubmit = useCallback(
//     async (values: Omit<User, "id" | "created_at">) => {
//       try {
//         if (mode === "create") {
//           const response = await addUser(values);
//           const newUser = extractUserFromResponse(response);
//           if (!newUser) {
//             throw new Error("Invalid response from server: missing user data");
//           }
//           showAlert({ type: "success", title: "Success!", message: "User added successfully" });
//           setUsers((prev) => [...prev, newUser]);
//         } else if (mode === "edit" && currentUser?.id) {
//           const response = await updateUser(currentUser.id, values);
//           const updatedUser = extractUserFromResponse(response);
//           if (!updatedUser) {
//             const patchedUser: User = {
//               ...currentUser,
//               ...values,
//             };
//             setUsers((prev) =>
//               prev.map((user) =>
//                 user.id === currentUser.id ? patchedUser : user
//               )
//             );
//           } else {
//             setUsers((prev) =>
//               prev.map((user) =>
//                 user.id === currentUser.id ? updatedUser : user
//               )
//             );
//           }
//           showAlert({ type: "success", title: "Success!", message: "User updated successfully" });
//         }
//         closeModal();
//       } catch (error) {
//         console.error("Submit error:", error);
//         showAlert({
//           type: "error",
//           title: "Error",
//           message: error instanceof Error ? error.message : "Operation failed",
//         });
//         closeModal();
//       }
//     },
//     [mode, currentUser, showAlert, closeModal]
//   );

//   const openDeleteModal = useCallback((user: User) => {
//     setCurrentUser(user);
//     setIsDeleteModalOpen(true);
//   }, []);

//   const handleDeleteConfirm = useCallback(async () => {
//     if (!currentUser?.id) return;
//     try {
//       await deleteUser(currentUser.id);
//       showAlert({ type: "success", title: "Success!", message: "User deleted successfully" });
//       setUsers((prev) => {
//         const newUsers = prev.filter((user) => user.id !== currentUser.id);
//         const filteredAfterDelete = newUsers.filter(
//           (u) =>
//             u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             u.email.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         const totalPages = Math.max(
//           1,
//           Math.ceil(filteredAfterDelete.length / itemsPerPage)
//         );
//         if (currentPage > totalPages && totalPages > 0) {
//           setTimeout(() => setCurrentPage(totalPages), 0);
//         }
//         return newUsers;
//       });
//     } catch (error) {
//       showAlert({
//         type: "error",
//         title: "Error",
//         message: error instanceof Error ? error.message : "Delete failed",
//       });
//     } finally {
//       setIsDeleteModalOpen(false);
//       setCurrentUser(null);
//     }
//   }, [currentUser, showAlert, searchTerm, currentPage, itemsPerPage]);

//   const filterUsers = useCallback(
//     (usersArray: User[]) => {
//       if (!searchTerm.trim()) return usersArray;
//       const term = searchTerm.toLowerCase();
//       return usersArray.filter(
//         (u) =>
//           u.full_name.toLowerCase().includes(term) ||
//           u.email.toLowerCase().includes(term)
//       );
//     },
//     [searchTerm]
//   );

//   const filteredUsers = useMemo(() => {
//     const safeUsers = Array.isArray(users) ? users : [];
//     return filterUsers(safeUsers);
//   }, [users, filterUsers]);

//   const totalPages = useMemo(() => {
//     return Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
//   }, [filteredUsers.length, itemsPerPage]);

//   const paginatedUsers = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredUsers, currentPage, itemsPerPage]);

//   const handleSearchChange = useCallback((value: string) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   }, []);

//   const handlePageChange = useCallback((page: number) => {
//     setCurrentPage(page);
//   }, []);

//   useEffect(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(totalPages);
//     }
//   }, [totalPages, currentPage]);

//   const getStatusColor = (status: string): "success" | "error" | "warning" | "info" => {
//     switch (status.toLowerCase()) {
//       case "active":
//         return "success";
//       case "inactive":
//         return "error";
//       case "pending":
//         return "warning";
//       default:
//         return "info";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="py-10 text-center text-gray-900 dark:text-white">
//         <div className="flex justify-center items-center space-x-2">
//           <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
//           <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//           <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//         </div>
//         <p className="mt-2 text-gray-600 dark:text-gray-400">Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
//         <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-4 gap-3">
//           <button
//             onClick={() => openModal("create")}
//             className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200"
//             title="Add New User"
//           >
//             <Plus size={20} />
//           </button>
//           <SearchBar value={searchTerm} onChange={handleSearchChange} placeholder="Search users..." />
//         </div>

//         <div className="max-w-full overflow-x-auto">
//           <Table className="min-w-175">
//             <TableHeader className="border-b border-gray-100 dark:border-white/5">
//               <TableRow>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
//                 >
//                   S.No
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
//                 >
//                   Name
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
//                 >
//                   Email
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
//                 >
//                   Phone
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
//                 >
//                   Status
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
//                 >
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
//               {paginatedUsers.length > 0 ? (
//                 paginatedUsers.map((user, index) => (
//                   <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                     <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
//                       <span className="text-sm text-gray-600 dark:text-gray-400">
//                         {(currentPage - 1) * itemsPerPage + index + 1}
//                       </span>
//                     </TableCell>
//                     <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
//                       <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                         {truncateText(user.full_name, 20)}
//                       </span>
//                     </TableCell>
//                     <TableCell className="px-4 py-3 text-start whitespace-nowrap">
//                       <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-theme-sm line-clamp-2">
//                         {truncateText(user.email, 25)}
//                       </span>
//                     </TableCell>
//                     <TableCell className="px-4 py-3 text-start whitespace-nowrap">
//                       <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
//                         {user.phone || "-"}
//                       </span>
//                     </TableCell>
//                     <TableCell className="px-4 py-3 text-start whitespace-nowrap">
//                       <Badge
//                         size="sm"
//                         color={getStatusColor(user.status)}
//                       >
//                         {user.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => openModal("view", user)}
//                           className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
//                           title="View Details"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           onClick={() => openModal("edit", user)}
//                           className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
//                           title="Edit User"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                           onClick={() => openDeleteModal(user)}
//                           className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
//                           title="Delete User"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
//                     <div className="flex flex-col items-center justify-center gap-2">
//                       <p className="text-lg font-medium">No users found</p>
//                       <p className="text-sm text-gray-400">
//                         {searchTerm ? `No results for "${searchTerm}"` : "Click + to create one"}
//                       </p>
//                       {!searchTerm && (
//                         <button
//                           onClick={() => openModal("create")}
//                           className="mt-2 inline-flex items-center justify-center p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
//                           title="Add New User"
//                         >
//                           <Plus size={16} />
//                         </button>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {totalPages > 1 && (
//           <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         )}
//       </div>

//       {/* Modal for Create/Edit/View */}
//       {isModalOpen && (
//         <Modal isOpen onClose={closeModal} className="max-w-md">
//           {mode === "view" && currentUser && (
//             <UserDetails user={currentUser} onClose={closeModal} />
//           )}
//           {(mode === "create" || mode === "edit") && (
//             <UserForm
//               mode={mode}
//               initialData={initialFormData}
//               onSubmit={handleFormSubmit}
//               onCancel={closeModal}
//             />
//           )}
//         </Modal>
//       )}

//       {/* Delete Confirmation Modal */}
//       {isDeleteModalOpen && currentUser && (
//         <Modal
//           isOpen
//           onClose={() => setIsDeleteModalOpen(false)}
//           className="max-w-md"
//         >
//           <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6">
//             <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
//               <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
//               Delete User
//             </h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
//               Are you sure you want to delete{" "}
//               <span className="font-medium text-gray-900 dark:text-white">
//                 {currentUser.full_name}
//               </span>? This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setIsDeleteModalOpen(false)}
//                 className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Alert Popup */}
//       {alert && (
//         <div className="fixed bottom-5 right-5 z-50 animate-slide-up">
//           <Alert
//             variant={alert.type}
//             title={alert.title}
//             message={alert.message}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default UserTableOne;





import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Alert from "../../ui/alert/Alert";
import { Trash2, Eye, Edit, Plus } from "lucide-react";
import Pagination from "../../ui/pagination/Pagination";
import { SearchBar } from "../../../hooks/SearchBar";
import {
  fetchAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../../store/api/Users-api";
import { User } from "../../../store/types/Users.types";
import UserForm from "./Form/UsersForm";
import UserDetails from "./Details/UsersDetail";

const truncateText = (text?: string, limit: number = 20) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};


const UserTableOne: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [initialFormData, setInitialFormData] = useState<Omit<User, "id" | "created_at">>({
    full_name: "",
    email: "",
    phone: "",
    user_type: "",
    status: "active",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  // Refs for custom modal backdrop click handling
  const modalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const showAlert = useCallback(
    (alertData: { type: "success" | "error" | "warning" | "info"; title: string; message: string }) => {
      setAlert(alertData);
      setTimeout(() => setAlert(null), 3000);
    },
    []
  );

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const timer = new Promise((resolve) => setTimeout(resolve, 800));
      const apiCall = fetchAllUsers();
      const [, result] = await Promise.all([timer, apiCall]);

      let usersArray: User[] = [];

      if (Array.isArray(result)) {
        usersArray = result;
      } else if (result && typeof result === "object") {
        if (Array.isArray(result.users)) {
          usersArray = result.users;
        } else if (Array.isArray(result.data)) {
          usersArray = result.data;
        } else if (Array.isArray(result.items)) {
          usersArray = result.items;
        } else {
          console.warn("Unexpected API response format:", result);
        }
      }

      const sanitizedUsers = usersArray
        .map((user) => ({
          id: typeof user.id === 'number' ? user.id : Number(user.id),
          full_name: user.full_name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          user_type: user.user_type ?? "",
          status: user.status ?? "active",
          created_at: user.created_at ?? new Date().toISOString(),
        }))
        .filter((user) => !isNaN(user.id));

      setUsers(sanitizedUsers);
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to load users",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openModal = useCallback(
    (type: "create" | "edit" | "view", user?: User) => {
      setMode(type);
      if (user) {
        setCurrentUser(user);
        if (type === "edit") {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, created_at, ...rest } = user;
          setInitialFormData(rest);
        }
      } else {
        setCurrentUser(null);
        setInitialFormData({
          full_name: "",
          email: "",
          phone: "",
          user_type: "",
          status: "active",
        });
      }
      setIsModalOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentUser(null);
  }, []);

  const extractUserFromResponse = (response: unknown): User | null => {
    if (!response || typeof response !== 'object') return null;

    const isUserObject = (obj: unknown): obj is Record<string, unknown> => {
      return obj !== null && typeof obj === 'object' && 'id' in obj;
    };

    let candidate: unknown = response;

    if ('user' in response) {
      candidate = (response as { user: unknown }).user;
    } else if ('data' in response) {
      candidate = (response as { data: unknown }).data;
    }

    if (!isUserObject(candidate)) return null;

    const id = Number(candidate.id);
    if (isNaN(id)) {
      console.error('Invalid id received from API:', candidate.id);
      return null;
    }

    return {
      id,
      full_name: candidate.full_name ? String(candidate.full_name) : '',
      email: candidate.email ? String(candidate.email) : '',
      phone: candidate.phone ? String(candidate.phone) : '',
      user_type: candidate.user_type ? String(candidate.user_type) : '',
      status: candidate.status ? String(candidate.status) : 'active',
      created_at: candidate.created_at ? String(candidate.created_at) : new Date().toISOString(),
    };
  };

  const handleFormSubmit = useCallback(
    async (values: Omit<User, "id" | "created_at">) => {
      try {
        if (mode === "create") {
          const response = await addUser(values);
          const newUser = extractUserFromResponse(response);
          if (!newUser) {
            throw new Error("Invalid response from server: missing user data");
          }
          showAlert({ type: "success", title: "Success!", message: "User added successfully" });
          setUsers((prev) => [...prev, newUser]);
        } else if (mode === "edit" && currentUser?.id) {
          const response = await updateUser(currentUser.id, values);
          const updatedUser = extractUserFromResponse(response);
          if (!updatedUser) {
            const patchedUser: User = {
              ...currentUser,
              ...values,
            };
            setUsers((prev) =>
              prev.map((user) =>
                user.id === currentUser.id ? patchedUser : user
              )
            );
          } else {
            setUsers((prev) =>
              prev.map((user) =>
                user.id === currentUser.id ? updatedUser : user
              )
            );
          }
          showAlert({ type: "success", title: "Success!", message: "User updated successfully" });
        }
        closeModal();
      } catch (error) {
        console.error("Submit error:", error);
        showAlert({
          type: "error",
          title: "Error",
          message: error instanceof Error ? error.message : "Operation failed",
        });
        closeModal();
      }
    },
    [mode, currentUser, showAlert, closeModal]
  );

  const openDeleteModal = useCallback((user: User) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      await deleteUser(currentUser.id);
      showAlert({ type: "success", title: "Success!", message: "User deleted successfully" });
      setUsers((prev) => {
        const newUsers = prev.filter((user) => user.id !== currentUser.id);
        const filteredAfterDelete = newUsers.filter(
          (u) =>
            u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const totalPages = Math.max(
          1,
          Math.ceil(filteredAfterDelete.length / itemsPerPage)
        );
        if (currentPage > totalPages && totalPages > 0) {
          setTimeout(() => setCurrentPage(totalPages), 0);
        }
        return newUsers;
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Delete failed",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setCurrentUser(null);
    }
  }, [currentUser, showAlert, searchTerm, currentPage, itemsPerPage]);

  const filterUsers = useCallback(
    (usersArray: User[]) => {
      if (!searchTerm.trim()) return usersArray;
      const term = searchTerm.toLowerCase();
      return usersArray.filter(
        (u) =>
          u.full_name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    },
    [searchTerm]
  );

  const filteredUsers = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : [];
    return filterUsers(safeUsers);
  }, [users, filterUsers]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  }, [filteredUsers.length, itemsPerPage]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const getStatusColor = (status: string): "success" | "error" | "warning" | "info" => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "info";
    }
  };

  // Custom modal handlers for click outside and escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
      if (isDeleteModalOpen && deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setIsDeleteModalOpen(false);
        setCurrentUser(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isModalOpen) closeModal();
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
          setCurrentUser(null);
        }
      }
    };

    if (isModalOpen || isDeleteModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isDeleteModalOpen, closeModal]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-900 dark:text-white">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-4 gap-3">
          <button
            onClick={() => openModal("create")}
            className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200"
            title="Add New User"
          >
            <Plus size={20} />
          </button>
          <SearchBar value={searchTerm} onChange={handleSearchChange} placeholder="Search users..." />
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-175">
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                >
                  S.No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {truncateText(user.full_name, 20)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-theme-sm line-clamp-2">
                        {truncateText(user.email, 25)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        {user.phone || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={getStatusColor(user.status)}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal("view", user)}
                          className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openModal("edit", user)}
                          className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {/* Replace TableCell with a standard <td> to avoid colSpan type error */}
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm ? `No results for "${searchTerm}"` : "Click + to create one"}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => openModal("create")}
                          className="mt-2 inline-flex items-center justify-center p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                          title="Add New User"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Custom Modal for Create/Edit/View – theme‑aware backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/70 dark:bg-black/70 overflow-y-auto">
          <div ref={modalRef} className="w-full max-w-md">
            {mode === "view" && currentUser && (
              <UserDetails user={currentUser} onClose={closeModal} />
            )}
            {(mode === "create" || mode === "edit") && (
              <UserForm
                mode={mode}
                initialData={initialFormData}
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}

      {/* Custom Delete Modal – theme‑aware backdrop */}
      {isDeleteModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/70 dark:bg-black/70 overflow-y-auto">
          <div ref={deleteModalRef} className="w-full max-w-md">
            <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                Delete User
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {currentUser.full_name}
                </span>? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Popup */}
      {alert && (
        <div className="fixed bottom-5 right-5 z-50 animate-slide-up">
          <Alert
            variant={alert.type}
            title={alert.title}
            message={alert.message}
          />
        </div>
      )}
    </>
  );
};

export default UserTableOne;


