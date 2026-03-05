import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import Alert from "../../../components/ui/alert/Alert";
import { Trash2, Eye, Edit, Plus, Mail, Calendar } from "lucide-react";
import Pagination from "../../../components/ui/pagination/Pagination";
import { SearchBar } from "../../../hooks/SearchBar";
import {
  getAllDonations,
  createDonation,
  updateDonationPut,
  deleteDonation,
  Donation,
} from "../../../store/api/Donations-api";
import DonationForm from "./form/DonationForm";
import DonationDetails from "./details/DonationView";

interface DonationTableOneProps {
  viewMode?: "table" | "grid";
}

const DonationTableOne: React.FC<DonationTableOneProps> = ({ viewMode = "table" }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [formData, setFormData] = useState<Donation>({
    donor_name: "",
    email: "",
    amount: 0,
    status: "Pending",
    donation_date: "",
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

    window.addEventListener('openAddDonationModal', handleOpenAddModal);
    return () => window.removeEventListener('openAddDonationModal', handleOpenAddModal);
  }, []);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllDonations();
      console.log("Fetched donations:", data);

      const safeData = Array.isArray(data) ? data : [];

      const sortedData = [...safeData].sort((a, b) => {
        const idA = typeof a.id === "string" ? parseInt(a.id) || 0 : a.id || 0;
        const idB = typeof b.id === "string" ? parseInt(b.id) || 0 : b.id || 0;
        return idA - idB;
      });

      setDonations(sortedData);
    } catch (error) {
      console.error("Error fetching donations:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to load donations",
      });
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const showAlert = (alertData: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }) => {
    setAlert(alertData);
    setTimeout(() => setAlert(null), 3000);
  };

  const openModal = (type: "create" | "edit" | "view", donation?: Donation) => {
    setMode(type);
    if (donation) {
      setCurrentDonation(donation);
      setFormData({ ...donation });
    } else {
      setCurrentDonation(null);
      setFormData({
        donor_name: "",
        email: "",
        amount: 0,
        status: "Pending",
        donation_date: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDonation(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.donor_name.trim()) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Donor name is required",
        });
        return;
      }
      if (!formData.email.trim()) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Email is required",
        });
        return;
      }
      if (!formData.amount || formData.amount <= 0) {
        showAlert({
          type: "error",
          title: "Validation Error",
          message: "Valid amount is required",
        });
        return;
      }

      showAlert({
        type: "info",
        title: mode === "create" ? "Creating Donation" : "Updating Donation",
        message: "Please wait...",
      });

      if (mode === "create") {
        const newDonation = await createDonation(formData);
        showAlert({
          type: "success",
          title: "Success!",
          message: "Donation created successfully",
        });

        setDonations((prev) => {
          const exists = prev.some((d) => d.id === newDonation.id);
          if (exists) {
            return prev;
          }

          return [...prev, newDonation].sort((a, b) => {
            const idA = typeof a.id === "string" ? parseInt(a.id) || 0 : a.id || 0;
            const idB = typeof b.id === "string" ? parseInt(b.id) || 0 : b.id || 0;
            return idA - idB;
          });
        });

        closeModal();
      }

      if (mode === "edit" && currentDonation?.id) {
        const updatedDonation = await updateDonationPut(currentDonation.id, formData);
        showAlert({
          type: "success",
          title: "Success!",
          message: "Donation updated successfully",
        });

        setDonations((prev) =>
          prev
            .map((donation) =>
              donation.id === currentDonation.id ? updatedDonation : donation,
            )
            .sort((a, b) => {
              const idA = typeof a.id === "string" ? parseInt(a.id) || 0 : a.id || 0;
              const idB = typeof b.id === "string" ? parseInt(b.id) || 0 : b.id || 0;
              return idA - idB;
            }),
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Operation failed",
      });
    }
  };

  const openDeleteModal = (donation: Donation) => {
    setCurrentDonation(donation);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentDonation?.id) return;
    try {
      showAlert({
        type: "info",
        title: "Deleting Donation",
        message: "Please wait...",
      });

      await deleteDonation(currentDonation.id);
      showAlert({
        type: "success",
        title: "Success!",
        message: "Donation deleted successfully",
      });

      setDonations((prev) => prev.filter((donation) => donation.id !== currentDonation.id));

      const updatedDonations = donations.filter((d) => d.id !== currentDonation.id);
      const filtered = filterDonations(updatedDonations);
      const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
      showAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Delete failed",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setCurrentDonation(null);
    }
  };

  const filterDonations = useCallback(
    (donationsArray: Donation[]) => {
      if (!searchTerm.trim()) {
        return donationsArray;
      }
      const term = searchTerm.toLowerCase();
      return donationsArray.filter(
        (donation) =>
          donation.donor_name?.toLowerCase().includes(term) ||
          donation.email?.toLowerCase().includes(term),
      );
    },
    [searchTerm],
  );

  const filteredDonations = useMemo(() => {
    const safeDonations = Array.isArray(donations) ? donations : [];
    return filterDonations(safeDonations);
  }, [donations, filterDonations]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredDonations.length / itemsPerPage));
  }, [filteredDonations.length, itemsPerPage]);

  const paginatedDonations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDonations.slice(startIndex, endIndex);
  }, [filteredDonations, currentPage, itemsPerPage]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success": return "success";
      case "Pending": return "warning";
      case "Failed": return "error";
      default: return "info";
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-900 dark:text-white">
        <div className="flex justify-center items-center space-x-2">
          <div
            className="w-4 h-4 bg-amber-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Loading donations...
        </p>
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
            title="Add New Donation"
          >
            <Plus size={20} />
          </button>
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search donations..."
          />
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
                  "Donor Name",
                  "Email",
                  "Amount",
                  "Status",
                  "Date",
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
              {paginatedDonations.length > 0 ? (
                paginatedDonations.map((donation, index) => (
                  <TableRow
                    key={String(donation.id)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {donation.donor_name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail size={14} />
                        <span className="text-sm">{donation.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        }).format(donation.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={getStatusColor(donation.status)}
                      >
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        {donation.donation_date 
                          ? new Date(donation.donation_date).toLocaleDateString() 
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal("view", donation)}
                          className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openModal("edit", donation)}
                          className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                          title="Edit Donation"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(donation)}
                          className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete Donation"
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
                      <p className="text-lg font-medium">No donations found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm 
                          ? `No results for "${searchTerm}"`
                          : "Click + to create one"}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => openModal("create")}
                          className="mt-2 inline-flex items-center justify-center p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                          title="Add New Donation"
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

      {/* Modal for Create/Edit/View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-md">
            {mode === "view" && currentDonation && (
              <DonationDetails donation={currentDonation} onClose={closeModal} />
            )}
            {(mode === "create" || mode === "edit") && (
              <DonationForm
                mode={mode}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentDonation && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1F2937] rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              Delete Donation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
              Are you sure you want to delete donation from{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {currentDonation.donor_name}
              </span>
              ? This action cannot be undone.
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
        </div>
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

export default DonationTableOne;