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
  const itemsPerPage = 6;

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

  // Search Logic
  const filteredAdmins = useMemo(() => {
    const safeAdmins = Array.isArray(admins) ? admins : [];
    if (!searchTerm.trim()) return safeAdmins;

    const term = searchTerm.toLowerCase();
    return safeAdmins.filter((a) =>
      [a.name, a.email, a.role].some((val) => (val || "").toLowerCase().includes(term))
    );
  }, [admins, searchTerm]);

  // Pagination Logic
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
      <div className="py-20 text-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-5 py-4 gap-3 border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => openModal("create")}
            className="inline-flex items-center justify-center p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 w-full sm:w-auto transition-colors rounded-lg border border-blue-100 dark:border-gray-600"
          >
            <Plus size={20} className="mr-1" /> <span className="text-sm font-medium"></span>
          </button>
          <div className="w-full sm:w-auto">
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-gray-50/50 dark:bg-gray-900/20">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 text-end text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedAdmins.length > 0 ? (
                paginatedAdmins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {admin.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {admin.email}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge color="info" size="sm">{admin.role}</Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-end">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openModal("view", admin)} className="rounded-full p-1.5 text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => openModal("edit", admin)} className="rounded-full p-1.5 text-amber-500 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => { setSelectedAdmin(admin); setIsDeleteModalOpen(true); }} className="rounded-full p-1.5 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                    No admins found {searchTerm ? `for "${searchTerm}"` : ""}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* View/Create/Edit Modals */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className={mode === 'view' ? "max-w-lg w-[90vw]" : "w-[90vw] md:w-[50vw] max-w-2xl"}>
        <div className="bg-white dark:bg-[#1F2937] rounded-xl overflow-hidden">
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAdmin && (
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-md w-[95vw] mx-auto">
          <div className="rounded-3xl bg-white p-6 dark:bg-[#1F2937]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-[#4FE7C0]">Delete Admin</h3>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-white">"{selectedAdmin.name}"</span>?
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="sm:w-32">
                Cancel
              </Button>
              {/* FIXED: Changed to variant="primary" to satisfy types, used className for the red color */}
              <Button 
                variant="primary" 
                onClick={confirmDelete} 
                className="sm:w-32 bg-red-600 hover:bg-red-700 text-white border-none"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Alert System */}
      {alert && (
        <div className="fixed bottom-5 right-2 z-50 w-[calc(100vw-1rem)] max-w-sm sm:w-72">
          <Alert variant={alert.type} title={alert.type === "success" ? "Success" : "Error"} message={alert.message} />
        </div>
      )}
    </>
  );
};

export default AdminTable;