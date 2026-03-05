import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Modal } from "../../ui/modal/index";
import Alert from "../../ui/alert/Alert";
import Button from "../../ui/button/Button";
import { Trash2, Eye, Edit, Plus, AlertTriangle } from "lucide-react";
import Pagination from "../../ui/pagination/Pagination.tsx";
import { SearchBar } from "../../../hooks/SearchBar.tsx";
import Badge from "../../ui/badge/Badge";
import Loader from "../../ui/loader/Loader.tsx";

import { adminService, Admin } from "../../../store/api/Admin-api";
import AdminTableForm from "../admin/form/AdminTableForm";
import AdminDetails from "../admin/Details/AdminDetailsModal";

const AdminTable: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 4;

  const showAlert = useCallback((alertData: { type: "success" | "error"; message: string }) => {
    setAlert(alertData);
    setTimeout(() => setAlert(null), 3500);
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAdmins();
      setAdmins(Array.isArray(data) ? data : []);
    } catch {
      showAlert({ type: "error", message: "Failed to load admins" });
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = useMemo(() => {
    const safeAdmins = Array.isArray(admins) ? admins : [];
    if (!searchTerm.trim()) return safeAdmins;

    const term = searchTerm.toLowerCase();
    return safeAdmins.filter((a) =>
      [a.name, a.email, a.role].some((val) => (val || "").toLowerCase().includes(term))
    );
  }, [admins, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredAdmins.length / itemsPerPage));
  }, [filteredAdmins.length, itemsPerPage]);

  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAdmins.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAdmins, currentPage, itemsPerPage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const openModal = (type: "create" | "edit" | "view", admin?: Admin) => {
    setMode(type);
    setSelectedAdmin(admin || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedAdmin(null);
      setMode("create");
    }, 200);
  };

  const handleSubmit = async (formData: Admin) => {
    try {
      if (mode === "create") {
        await adminService.createAdmin(formData);
        showAlert({ type: "success", message: "Admin created successfully" });
      } else if (mode === "edit" && selectedAdmin?.id) {
        await adminService.patchAdmin(selectedAdmin.id, formData);
        showAlert({ type: "success", message: "Admin updated successfully" });
      }
      fetchAdmins();
      closeModal();
    } catch (error: any) {
      showAlert({ type: "error", message: error.message || "Operation failed" });
    }
  };

  const confirmDelete = async () => {
    if (!selectedAdmin?.id) return;
    try {
      await adminService.deleteAdmin(selectedAdmin.id);
      showAlert({ type: "success", message: "Admin deleted successfully" });
      fetchAdmins();
    } catch {
      showAlert({ type: "error", message: "Delete failed" });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedAdmin(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center bg-white dark:bg-gray-900 min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-5 gap-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => openModal("create")}
            className="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all rounded-lg shadow-md hover:shadow-lg w-full sm:w-auto active:scale-95"
          >
            <Plus size={18} className="mr-2" />
            Add Admin
          </button>
          <div className="w-full sm:w-80">
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gray-50 dark:bg-gray-800/40">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Role</TableCell>
                <TableCell isHeader className="px-6 py-4 text-end text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedAdmins.length > 0 ? (
                paginatedAdmins.map((admin) => (
                  <TableRow key={admin.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {admin.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {admin.email}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        color="info" 
                        size="sm" 
                        className="font-bold capitalize px-3 py-1"
                      >
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-end">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => openModal("view", admin)} 
                          className="rounded-lg p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openModal("edit", admin)} 
                          className="rounded-lg p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 transition-all"
                          title="Edit Admin"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => { setSelectedAdmin(admin); setIsDeleteModalOpen(true); }} 
                          className="rounded-lg p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-all"
                          title="Delete Admin"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-6 py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                    <div className="flex flex-col items-center">
                      <p className="text-base font-medium">No results found</p>
                      <p className="text-sm opacity-70">Try adjusting your search terms</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-900/50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} className={mode === 'view' ? "max-w-lg w-[90vw]" : "w-[100vw] md:w-[90vw] max-w-3xl"}>
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
          {mode === "view" && selectedAdmin ? (
            <AdminDetails admin={selectedAdmin} onClose={closeModal} />
          ) : (
            <AdminTableForm 
              onClose={closeModal} 
              adminData={selectedAdmin || undefined} 
              onSubmit={handleSubmit} 
            />
          )}
        </div>
      </Modal>

      {isDeleteModalOpen && selectedAdmin && (
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-md w-[95vw] mx-auto">
          <div className="bg-white p-8 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 animate-pulse">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Delete Admin</h3>
              <p className="mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-gray-100 underline decoration-red-500/30">"{selectedAdmin.name}"</span>? This action is permanent.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="w-full sm:w-32 order-2 sm:order-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={confirmDelete} 
                className="w-full sm:w-32 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-200 dark:shadow-none order-1 sm:order-2 transition-transform active:scale-95"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {alert && (
        <div className="fixed bottom-8 right-8 z-[100] w-[calc(100vw-4rem)] max-w-sm drop-shadow-2xl">
          <Alert variant={alert.type} title={alert.type === "success" ? "Success" : "Error"} message={alert.message} />
        </div>
      )}
    </>
  );
};

export default AdminTable;