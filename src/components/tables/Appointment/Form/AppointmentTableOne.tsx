import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Modal } from "../../../ui/modal";
import Badge from "../../../ui/badge/Badge";
import Alert from "../../../ui/alert/Alert";
import { Trash2, Eye, Edit, Plus, Calendar,User, Users } from "lucide-react";
import Pagination from "../../../ui/Pagination/Pagination";
import { SearchBar } from "../../../../hooks/SearchBar";
import {
  getAllAppointments,
  createAppointment,
  updateAppointmentPut,
  deleteAppointment,
  Appointment,
} from "../../../../store/appointment-api";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetails from "../Details/AppointmentDetails";

const MOCK_USERS = [
  { id: 1, full_name: "Mohan Deshpande" },
  { id: 2, full_name: "Sneha Kapoor" },
  { id: 3, full_name: "Rajendra Pawar" },
  { id: 4, full_name: "Fatima Sheikh" },
  { id: 5, full_name: "Arjun Singh" },
  { id: 6, full_name: "Meera Nair" },
  { id: 7, full_name: "Carlos Rodriguez" },
  { id: 8, full_name: "Lakshmi Iyer" },
  { id: 9, full_name: "John Smith" },
  { id: 10, full_name: "Priyanka Chopra" },
];

const MOCK_VOLUNTEERS = [
  { id: 1, full_name: "Arjun Singh", user_id: 5 },
  { id: 2, full_name: "Priyanka Chopra", user_id: 10 },
  { id: 3, full_name: "Lakshmi Iyer", user_id: 8 },
  { id: 4, full_name: "Carlos Rodriguez", user_id: 7 },
  { id: 5, full_name: "Meera Nair", user_id: 6 },
  { id: 6, full_name: "John Smith", user_id: 9 },
  { id: 7, full_name: "Rajendra Pawar", user_id: 3 },
];

interface AppointmentTableOneProps {
  viewMode?: "table" | "grid";
}

const AppointmentTableOne: React.FC<AppointmentTableOneProps> = ({ viewMode = "table" }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  
  const [formData, setFormData] = useState<{
    user_id: string | number;
    volunteer_id: string | number;
    appointment_date: string;
    appointment_time: string;
    status: "Pending" | "Approved" | "Completed" | "Cancelled" | "Rescheduled";
  }>({
    user_id: "",
    volunteer_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "Pending",
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleOpenAddModal = () => {
      openModal("create");
    };
    window.addEventListener('openAddAppointmentModal', handleOpenAddModal);
    return () => {
      window.removeEventListener('openAddAppointmentModal', handleOpenAddModal);
    };
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAppointments();
      const safeData = Array.isArray(data) ? data : [];
      const sortedData = [...safeData].sort((a, b) => {
        const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id || 0;
        const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id || 0;
        return idA - idB;
      });
      setAppointments(sortedData);
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to load appointments"
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const showAlert = (alertData: any) => {
    setAlert(alertData);
    setTimeout(() => setAlert(null), 3000);
  };

  const openModal = (type: "create" | "edit" | "view", appointment?: Appointment) => {
    setMode(type);
    if (appointment) {
      setCurrentAppointment(appointment);
      setFormData({
        user_id: appointment.user_id,
        volunteer_id: appointment.volunteer_id,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        status: appointment.status,
      });
    } else {
      setCurrentAppointment(null);
      setFormData({
        user_id: "",
        volunteer_id: "",
        appointment_date: "",
        appointment_time: "",
        status: "Pending",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAppointment(null);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.user_id) {
        showAlert({ type: "error", title: "Error", message: "Please select a user" });
        return;
      }
      if (!formData.volunteer_id) {
        showAlert({ type: "error", title: "Error", message: "Please select a volunteer" });
        return;
      }
      if (!formData.appointment_date) {
        showAlert({ type: "error", title: "Error", message: "Please select appointment date" });
        return;
      }
      if (!formData.appointment_time) {
        showAlert({ type: "error", title: "Error", message: "Please select appointment time" });
        return;
      }

      if (mode === "create") {
        const newAppointment = await createAppointment(formData);
        showAlert({ type: "success", title: "Success!", message: "Appointment created successfully" });
        setAppointments((prev) => [...prev, newAppointment].sort((a, b) => {
          const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id || 0;
          const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id || 0;
          return idA - idB;
        }));
        closeModal();
      }
      
      if (mode === "edit" && currentAppointment?.id) {
        const updatedAppointment = await updateAppointmentPut(currentAppointment.id, formData);
        showAlert({ type: "success", title: "Success!", message: "Appointment updated successfully" });
        setAppointments((prev) =>
          prev.map((app) => app.id === currentAppointment.id ? updatedAppointment : app)
        );
        closeModal();
      }
    } catch (error: any) {
      showAlert({ type: "error", title: "Error", message: error.message });
    }
  };

  const openDeleteModal = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentAppointment?.id) return;
    try {
      await deleteAppointment(currentAppointment.id);
      showAlert({ type: "success", title: "Success!", message: "Appointment deleted successfully" });
      setAppointments((prev) => prev.filter((app) => app.id !== currentAppointment.id));
    } catch (error: any) {
      showAlert({ type: "error", title: "Error", message: error.message });
    } finally {
      setIsDeleteModalOpen(false);
      setCurrentAppointment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "success";
      case "Pending": return "warning";
      case "Completed": return "info";
      case "Cancelled": return "error";
      case "Rescheduled": return "warning";
      default: return "info";
    }
  };

  const formatTime = (time: string) => time.substring(0, 5);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filterAppointments = useCallback((apps: Appointment[]) => {
    if (!searchTerm.trim()) return apps;
    const term = searchTerm.toLowerCase();
    return apps.filter((app) =>
      app.user_name?.toLowerCase().includes(term) ||
      app.volunteer_name?.toLowerCase().includes(term) ||
      app.appointment_date.includes(term)
    );
  }, [searchTerm]);

  const filteredAppointments = useMemo(() => filterAppointments(appointments), [appointments, filterAppointments]);
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading appointments...</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-4 gap-3">
          <button
            onClick={() => openModal("create")}
            className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-amber-600 hover:bg-amber-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all"
            title="Schedule New Appointment"
          >
            <Plus size={20} />
          </button>
          <SearchBar value={searchTerm} onChange={handleSearchChange} placeholder="Search appointments..." />
        </div>

        {viewMode && (
          <div className="px-5 pb-2 text-xs text-gray-500 dark:text-gray-400">
            Current view: {viewMode === "table" ? "Table View" : "Grid View"}
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["S.No", "User", "Volunteer", "Date & Time", "Status", "Actions"].map((head) => (
                  <TableCell key={head} isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAppointments.length > 0 ? (
                paginatedAppointments.map((app, index) => (
                  <TableRow key={String(app.id)} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-gray-800 dark:text-white">
                          {app.user_name || `User ${app.user_id}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-800 dark:text-white">
                          {app.volunteer_name || `Volunteer ${app.volunteer_id}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(app.appointment_date)} {formatTime(app.appointment_time)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal("view", app)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openModal("edit", app)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => openDeleteModal(app)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell  className="px-4 py-8 text-center text-gray-500">
                    <p>No appointments found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <Modal isOpen onClose={closeModal} className="max-w-md">
          {mode === "view" && currentAppointment && (
            <AppointmentDetails appointment={currentAppointment} onClose={closeModal} />
          )}
          {(mode === "create" || mode === "edit") && (
            <AppointmentForm
              mode={mode}
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              users={MOCK_USERS}
              volunteers={MOCK_VOLUNTEERS}
            />
          )}
        </Modal>
      )}

      {isDeleteModalOpen && currentAppointment && (
        <Modal isOpen onClose={() => setIsDeleteModalOpen(false)} className="max-w-md">
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-center mb-4">Delete Appointment</h3>
            <p className="text-sm text-center text-gray-600 mb-6">
              Are you sure you want to delete this appointment?
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {alert && (
        <div className="fixed bottom-5 right-5 z-50">
          <Alert variant={alert.type} title={alert.title} message={alert.message} />
        </div>
      )}
    </>
  );
};

export default AppointmentTableOne;