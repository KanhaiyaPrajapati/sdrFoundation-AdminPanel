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
import { Trash2, Eye, Edit, Plus } from "lucide-react";
import Pagination from "../../../ui/Pagination/Pagination";
import { SearchBar } from "../../../../hooks/SearchBar";
import {
  getAllServices,
  createService,
  updateServicePut,
  deleteService,
  Service,
} from "../../../../store/service-api";
import ServiceForm from "./ServiceForm";
import ServiceDetails from "../Details/ServiceDetails";

// ===========================================
// PROPS INTERFACE
// ===========================================
interface ServiceTableOneProps {
  viewMode?: "table" | "grid";
}

// ===========================================
// COMPONENT WITH PROPS
// ===========================================
const ServiceTableOne: React.FC<ServiceTableOneProps> = ({ viewMode = "table" }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [formData, setFormData] = useState<Service>({
    service_name: "",
    description: "",
    category: "",
    status: "active",
  });

  // Alert state for popup notifications
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  // ===========================================
  // CUSTOM EVENT LISTENER
  // ===========================================
  useEffect(() => {
    const handleOpenAddModal = () => {
      openModal("create");
    };

    window.addEventListener('openAddServiceModal', handleOpenAddModal);
    
    return () => {
      window.removeEventListener('openAddServiceModal', handleOpenAddModal);
    };
  }, []);

  // Fetch all services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      console.log("Fetched services:", data);
      
      // Ensure data is array
      const safeData = Array.isArray(data) ? data : [];
      
      // Sort by ID in ascending order (oldest first)
      const sortedData = [...safeData].sort((a, b) => {
        // Convert IDs to numbers for comparison
        const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id || 0;
        const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id || 0;
        return idA - idB; // Ascending order (oldest first)
      });
      
      setServices(sortedData);
    } catch (error) {
      console.error("Error fetching services:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to load services"
      });
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Show alert popup
  const showAlert = (alertData: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }) => {
    setAlert(alertData);
    // Auto hide after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };

  // Open modal for create/edit/view
  const openModal = (type: "create" | "edit" | "view", service?: Service) => {
    setMode(type);
    if (service) {
      setCurrentService(service);
      setFormData({ ...service });
    } else {
      setCurrentService(null);
      setFormData({
        service_name: "",
        description: "",
        category: "",
        status: "active",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle status between active/inactive
  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active",
    }));
  };

  // Handle form submission (create/edit)
  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.service_name.trim()) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Service name is required"
        });
        return;
      }
      if (!formData.category) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Category is required"
        });
        return;
      }

      // Show loading popup
      showAlert({
        type: "info",
        title: mode === "create" ? "Creating Service" : "Updating Service",
        message: "Please wait...",
      });

      if (mode === "create") {
        const newService = await createService(formData);
        showAlert({
          type: "success",
          title: "Success!",
          message: "Service created successfully",
        });
        
        // Add new service and sort in ascending order (oldest first)
        setServices((prev) => {
          // Check if service already exists
          const exists = prev.some(s => s.id === newService.id);
          if (exists) {
            return prev;
          }
          
          // Add new service and sort by ID in ascending order
          return [...prev, newService].sort((a, b) => {
            const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id || 0;
            const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id || 0;
            return idA - idB;
          });
        });
        
        closeModal();
      }
      
      if (mode === "edit" && currentService?.id) {
        const updatedService = await updateServicePut(currentService.id, formData);
        showAlert({
          type: "success",
          title: "Success!",
          message: "Service updated successfully",
        });
        
        // Update and sort in ascending order (oldest first)
        setServices((prev) =>
          prev.map((service) =>
            service.id === currentService.id ? updatedService : service
          ).sort((a, b) => {
            const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id || 0;
            const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id || 0;
            return idA - idB;
          })
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Operation failed"
      });
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (service: Service) => {
    setCurrentService(service);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!currentService?.id) return;
    try {
      // Show loading popup
      showAlert({
        type: "info",
        title: "Deleting Service",
        message: "Please wait...",
      });

      await deleteService(currentService.id);
      showAlert({
        type: "success",
        title: "Success!",
        message: "Service deleted successfully",
      });

      // Remove from state
      setServices((prev) => prev.filter((service) => service.id !== currentService.id));
      
      // Adjust current page if needed
      const updatedServices = services.filter((s) => s.id !== currentService.id);
      const filtered = filterServices(updatedServices);
      const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Delete failed"
      });
    } finally {
      setIsDeleteModalOpen(false);
      setCurrentService(null);
    }
  };

  // Filter services based on search term
  const filterServices = useCallback(
    (servicesArray: Service[]) => {
      if (!searchTerm.trim()) {
        return servicesArray;
      }
      const term = searchTerm.toLowerCase();
      return servicesArray.filter(
        (service) =>
          service.service_name.toLowerCase().includes(term) ||
          service.description?.toLowerCase().includes(term) ||
          service.category.toLowerCase().includes(term),
      );
    },
    [searchTerm],
  );

  // Memoized filtered services
  const filteredServices = useMemo(() => {
    const safeServices = Array.isArray(services) ? services : [];
    return filterServices(safeServices);
  }, [services, filterServices]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredServices.length / itemsPerPage));
  }, [filteredServices.length, itemsPerPage]);

  // Get paginated services
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredServices.slice(startIndex, endIndex);
  }, [filteredServices, currentPage, itemsPerPage]);

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Adjust current page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Loading state
  if (loading) {
    return (
      <div className="py-10 text-center text-gray-900 dark:text-white">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading services...</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-4 gap-3">
          {/* =========================================== */}
          {/* UPDATED: Only Plus Icon, No Text */}
          {/* =========================================== */}
          <button
            onClick={() => openModal("create")}
            className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200"
            title="Add New Service"
          >
            <Plus size={20} />
          </button>
          <SearchBar value={searchTerm} onChange={handleSearchChange} placeholder="Search services..." />
        </div>

        {/* View Mode Indicator (optional) */}
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
                  "Service Name",
                  "Category",
                  "Description",
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
              {paginatedServices.length > 0 ? (
                paginatedServices.map((service, index) => (
                  <TableRow key={String(service.id)} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {service.service_name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <Badge size="sm" color="info">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span className="text-black dark:text-gray-400 block max-w-xs text-sm">
                        {service.description && service.description.length > 50
                          ? `${service.description.substring(0, 50)}...`
                          : service.description || "No description"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={service.status === "active" ? "success" : "error"}
                      >
                        {service.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal("view", service)}
                          className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openModal("edit", service)}
                          className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                          title="Edit Service"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(service)}
                          className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-lg font-medium">No services found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm ? `No results for "${searchTerm}"` : "Click + to create one"}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => openModal("create")}
                          className="mt-2 inline-flex items-center justify-center p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                          title="Add New Service"
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

      {/* Create/Edit/View Modal */}
      {isModalOpen && (
        <Modal isOpen onClose={closeModal} className="max-w-md">
          {mode === "view" && currentService && (
            <ServiceDetails service={currentService} onClose={closeModal} />
          )}
          {(mode === "create" || mode === "edit") && (
            <ServiceForm
              mode={mode}
              formData={formData}
              onChange={handleChange}
              onToggleStatus={toggleStatus}
              onSubmit={handleSubmit}
              onCancel={closeModal}
            />
          )}
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentService && (
        <Modal
          isOpen
          onClose={() => setIsDeleteModalOpen(false)}
          className="max-w-md"
        >
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              Delete Service
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {currentService?.service_name}
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
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
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

export default ServiceTableOne;

