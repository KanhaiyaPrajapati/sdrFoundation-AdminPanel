import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { Trash2, Eye, Edit, Plus, Calendar, Clock, User, Users } from "lucide-react";
import Pagination from "../../../ui/Pagination/Pagination";
import { SearchBar } from "../../../../hooks/SearchBar";
import {
  getAllAppointments,
  createAppointment,
  updateAppointmentPut,
  deleteAppointment,
  Appointment,
} from "../../../../store/appointment-api";
import { getAllUsers, User as UserType } from "../../../../store/user-api";
import { getAllVolunteers, Volunteer as VolunteerType } from "../../../../store/volunteer-api";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetails from "../Details/AppointmentDetails";

interface AppointmentTableOneProps {
  viewMode?: "table" | "grid";
}

const AppointmentTableOne: React.FC<AppointmentTableOneProps> = ({ viewMode = "table" }) => {
  const isFirstLoad = useRef(true);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerType[]>([]);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [appointmentsData, usersData, volunteersData] = await Promise.all([
        getAllAppointments(),
        getAllUsers(),
        getAllVolunteers()
      ]);
      
      const safeAppointments = Array.isArray(appointmentsData) ? appointmentsData : [];
      const sortedAppointments = [...safeAppointments].sort((a, b) => {
        const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id || 0;
        const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id || 0;
        return idA - idB;
      });
      setAppointments(sortedAppointments);
      
      const safeUsers = Array.isArray(usersData) ? usersData : [];
      setUsers(safeUsers);
      
      const safeVolunteers = Array.isArray(volunteersData) ? volunteersData : [];
      
      const enhancedVolunteers = safeVolunteers.map(vol => {
        const user = safeUsers.find(u => u.id === vol.user_id);
        return {
          ...vol,
          full_name: user?.full_name || `Volunteer ${vol.id}`
        };
      });
      setVolunteers(enhancedVolunteers);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to load data"
      });
      setAppointments([]);
      setUsers([]);
      setVolunteers([]);
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

      const selectedUser = users.find(u => u.id.toString() === formData.user_id.toString());
      const selectedVolunteer = volunteers.find(v => v.id.toString() === formData.volunteer_id.toString());
      
      if (selectedUser && selectedVolunteer && selectedUser.id.toString() === selectedVolunteer.user_id?.toString()) {
        showAlert({ type: "error", title: "Error", message: "User and Volunteer cannot be the same person" });
        return;
      }

      if (mode === "create") {
        await createAppointment(formData);
        showAlert({ type: "success", title: "Success!", message: "Appointment created successfully" });
        
        await fetchData();
        closeModal();
      }
      
      if (mode === "edit" && currentAppointment?.id) {
        await updateAppointmentPut(currentAppointment.id, formData);
        showAlert({ type: "success", title: "Success!", message: "Appointment updated successfully" });
        
        await fetchData();
        closeModal();
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      showAlert({ 
        type: "error", 
        title: "Error", 
        message: error.response?.data?.message || error.message || "Failed to save appointment" 
      });
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
      
      await fetchData();
    } catch (error: any) {
      console.error("Delete error:", error);
      showAlert({ 
        type: "error", 
        title: "Error", 
        message: error.response?.data?.message || error.message || "Failed to delete appointment" 
      });
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
      app.appointment_date.includes(term) ||
      app.status.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredAppointments = useMemo(() => {
    return filterAppointments(appointments);
  }, [appointments, filterAppointments]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
  }, [filteredAppointments.length, itemsPerPage]);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, currentPage, itemsPerPage]);

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

  if (loading && isFirstLoad.current) {
    return (
      <div className="py-10 text-center text-gray-900 dark:text-white">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
            className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-amber-600 hover:bg-amber-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200"
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
          <Table className="min-w-175">
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                {[
                  "S.No",
                  "User",
                  "Volunteer",
                  "Date & Time",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <TableCell
                    key={head}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedAppointments.length > 0 ? (
                paginatedAppointments.map((app, index) => (
                  <TableRow key={String(app.id)} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {app.user_name || `User ${app.user_id}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                          <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {app.volunteer_name || `Volunteer ${app.volunteer_id}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(app.appointment_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {formatTime(app.appointment_time)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={getStatusColor(app.status)}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal("view", app)}
                          className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openModal("edit", app)}
                          className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                          title="Edit Appointment"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(app)}
                          className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete Appointment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-lg font-medium">No appointments found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm ? `No results for "${searchTerm}"` : "Click + to schedule an appointment"}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => openModal("create")}
                          className="mt-2 inline-flex items-center justify-center p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                          title="Schedule New Appointment"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </TableCell>
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
              users={users}
              volunteers={volunteers}
            />
          )}
        </Modal>
      )}

      {isDeleteModalOpen && currentAppointment && (
        <Modal isOpen onClose={() => setIsDeleteModalOpen(false)} className="max-w-md">
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              Delete Appointment
            </h3>
            <p className="text-sm text-gray-600 dark:text-white/70 mb-6 text-center">
              Are you sure you want to delete this appointment? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

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

export default AppointmentTableOne;