import { useState, useEffect, useMemo, useCallback, ChangeEvent } from "react";
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
import Pagination from "../../../ui/pagination/Pagination";
import { SearchBar } from "../../../../components/ui/search/SearchBar";
import {
  getAllVolunteers,
  createVolunteer,
  updateVolunteerPut,
  deleteVolunteer,
  checkUserExists,
  Volunteer,
} from "../../../../store/volunteers-api";
import VolunteerForm from "../Form/VolunteersForm";
import VolunteerDetails from "../Details/VolunteersDetails";
const VolunteersTableOne: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(
    null,
  );
  const [mode, setMode] = useState<"create" | "view" | "edit">("create");
  const [formData, setFormData] = useState<Volunteer>({
    user_id: "",
    skills: "",
    availability: "",
    joined_date: new Date().toISOString().split("T")[0],
    name: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [searchTerm, setSearchTerm] = useState("");
  const [validationTimer, setValidationTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching volunteers...");
      const data = await getAllVolunteers();
      console.log("Received volunteers:", data);
      const sortedData = [...data].sort((a, b) => {
        const idA = parseInt(String(a.user_id)) || 0;
        const idB = parseInt(String(b.user_id)) || 0;
        return idA - idB;
      });

      setVolunteers(sortedData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to load volunteers:", error);
      showAlert({
        type: "error",
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to load volunteers",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);
  const showAlert = (alertData: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }) => {
    setAlert(alertData);
    setTimeout(() => setAlert(null), 3000);
  };
  const openModal = (
    type: "create" | "view" | "edit",
    volunteer?: Volunteer,
  ) => {
    setMode(type);
    setUserError(null);

    if (volunteer) {
      setCurrentVolunteer(volunteer);
      setFormData({
        ...volunteer,
        user_id: String(volunteer.user_id || ""),
      });
    } else {
      setCurrentVolunteer(null);
      setFormData({
        user_id: "",
        skills: "",
        availability: "",
        joined_date: new Date().toISOString().split("T")[0],
        name: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserError(null);
    setIsCheckingUser(false);

    if (validationTimer) {
      clearTimeout(validationTimer);
      setValidationTimer(null);
    }
  };
  const handleChange = async (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: any } },
  ) => {
    const { name, value } = e.target;
    const processedValue = name === "user_id" ? String(value) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (validationTimer) {
      clearTimeout(validationTimer);
      setValidationTimer(null);
    }
    if (name === "user_id" && mode !== "view") {
      const userIdStr = String(value);
      if (!userIdStr.trim()) {
        setUserError(null);
        return;
      }
      setIsCheckingUser(true);
      setUserError(null);
      const timer = setTimeout(async () => {
        try {
          console.log(`Checking if user ID ${userIdStr} exists...`);
          const userExists = await checkUserExists(userIdStr);
          console.log(`User ID ${userIdStr} exists:`, userExists);

          if (!userExists) {
            const errorMsg = `User ID ${userIdStr} is not registered in the system`;
            setUserError(errorMsg);
            showAlert({
              type: "warning",
              title: "User Not Found",
              message: errorMsg,
            });
          }
        } catch (error) {
          console.error("Error checking user:", error);
          setUserError("Failed to verify user. Please try again.");
        } finally {
          setIsCheckingUser(false);
        }
      }, 500);

      setValidationTimer(timer);
    }
    if (name !== "user_id") {
      setUserError(null);
    }
  };
  const handleSubmit = async () => {
    try {
      const userIdStr = String(formData.user_id || "").trim();
      if (mode === "create") {
        if (!userIdStr) {
          showAlert({
            type: "error",
            title: "Validation Error",
            message: "User ID is required",
          });
          return;
        }
        showAlert({
          type: "info",
          title: "Checking User",
          message: `Verifying if User ID ${userIdStr} exists...`,
        });

        setIsCheckingUser(true);
        const userExists = await checkUserExists(userIdStr);
        setIsCheckingUser(false);

        if (!userExists) {
          setUserError(`User ID ${userIdStr} is not registered`);
          showAlert({
            type: "error",
            title: "User Not Found",
            message: `User ID ${userIdStr} is not registered in the system. Please enter a valid User ID.`,
          });
          return;
        }
      }
      showAlert({
        type: "info",
        title: mode === "create" ? "Creating Volunteer" : "Updating Volunteer",
        message: "Please wait...",
      });
      const payload = {
        ...formData,
        user_id: userIdStr,
      };
      if (mode === "create") {
        await createVolunteer(payload);
        showAlert({
          type: "success",
          title: "Success!",
          message: "Volunteer created successfully",
        });
      } else if (mode === "edit" && currentVolunteer?.id) {
        await updateVolunteerPut(currentVolunteer.id, payload);
        showAlert({
          type: "success",
          title: "Success!",
          message: "Volunteer updated successfully",
        });
      }

      await fetchVolunteers();
      closeModal();
    } catch (error) {
      console.error("Operation failed:", error);
      showAlert({
        type: "error",
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : mode === "create"
              ? "Failed to create volunteer"
              : "Failed to update volunteer",
      });
    } finally {
      setIsCheckingUser(false);
    }
  };
  const openDeleteModal = (volunteer: Volunteer) => {
    setCurrentVolunteer(volunteer);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (!currentVolunteer?.id) return;

    try {
      showAlert({
        type: "info",
        title: "Deleting Volunteer",
        message: "Please wait...",
      });

      await deleteVolunteer(currentVolunteer.id);
      showAlert({
        type: "success",
        title: "Success!",
        message: "Volunteer deleted successfully",
      });

      await fetchVolunteers();
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to delete volunteer",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setCurrentVolunteer(null);
    }
  };
  const filteredVolunteers = useMemo(() => {
    if (!searchTerm.trim()) {
      return volunteers;
    }
    const term = searchTerm.toLowerCase().trim();
    return volunteers.filter((volunteer) => {
      const userIdStr = String(volunteer.user_id || "").toLowerCase();
      const skillsStr = String(volunteer.skills || "").toLowerCase();
      const availabilityStr = String(
        volunteer.availability || "",
      ).toLowerCase();

      return (
        userIdStr.includes(term) ||
        skillsStr.includes(term) ||
        availabilityStr.includes(term)
      );
    });
  }, [volunteers, searchTerm]);
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredVolunteers.length / itemsPerPage));
  }, [filteredVolunteers.length, itemsPerPage]);
  useEffect(() => {
    if (searchTerm.trim() && currentPage > totalPages) {
      setCurrentPage(1);
    } else if (
      !searchTerm.trim() &&
      currentPage > totalPages &&
      totalPages > 0
    ) {
      setCurrentPage(totalPages);
    }
  }, [filteredVolunteers, currentPage, totalPages, searchTerm]);
  const paginatedVolunteers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVolunteers.slice(startIndex, endIndex);
  }, [filteredVolunteers, currentPage, itemsPerPage]);
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  useEffect(() => {
    return () => {
      if (validationTimer) {
        clearTimeout(validationTimer);
      }
    };
  }, [validationTimer]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-900 dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-4 gap-3">
          <div className="relative group inline-block">
            <div className="absolute -inset-0.5 bg-linear-to-r from-amber-500 via-orange-300 to-emerald-500 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-[2px]"></div>

            <button
              onClick={() => openModal("create")}
              title="Add New Volunteer"
              className="relative inline-flex items-center justify-center rounded-lg bg-white p-2 text-blue-600 hover:text-amber-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-amber-400 transition-colors duration-200"
            >
              <Plus size={20} />
            </button>
          </div>
          <SearchBar value={searchTerm} onChange={handleSearchChange} />
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-175">
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                {[
                  "User ID",
                  "Skills",
                  "Availability",
                  "Joined Date",
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
              {paginatedVolunteers.length > 0 ? (
                paginatedVolunteers.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {String(volunteer.user_id)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <span className="text-black dark:text-gray-400">
                        {volunteer.skills.length > 30
                          ? `${volunteer.skills.slice(0, 30)}...`
                          : volunteer.skills}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                      <Badge size="sm" color="info">
                        {volunteer.availability}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap">
                      {new Date(volunteer.joined_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal("view", volunteer)}
                          className="relative group p-2 text-gray-600 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-all duration-200"
                          title="View Details"
                        >
                          <div className="absolute -inset-1.5 bg-linear-to-r from-amber-500/20 via-orange-500/20 to-emerald-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                          <Eye size={16} className="relative z-10" />
                        </button>

                        <button
                          onClick={() => openModal("edit", volunteer)}
                          className="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400"
                          title="Edit Volunteer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(volunteer)}
                          className="p-2 text-red-500 hover:text-red-600 dark:text-red-400"
                          title="Delete Volunteer"
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
                    <div style={{ gridColumn: "span 5" }}>
                      No volunteers found{" "}
                      {searchTerm ? `for "${searchTerm}"` : ""}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen onClose={closeModal} className="max-w-100">
          {mode === "view" && currentVolunteer && (
            <VolunteerDetails
              volunteer={currentVolunteer}
              onClose={closeModal}
            />
          )}
          {(mode === "create" || mode === "edit") && (
            <VolunteerForm
              mode={mode}
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              isCheckingUser={isCheckingUser}
              userError={userError}
            />
          )}
        </Modal>
      )}
      {isDeleteModalOpen && (
        <Modal
          isOpen
          onClose={() => setIsDeleteModalOpen(false)}
          className="max-w-sm"
        >
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-1 w-full bg-linear-to-r from-red-500 via-rose-500 to-pink-500" />
            <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                  Delete Volunteer
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">
                    Action
                  </span>
                  <span className="text-[9px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400">
                    DELETE
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                    Are you sure you want to delete this volunteer?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This action cannot be undone. The volunteer will be
                    permanently removed from the system.
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Volunteer Details
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">
                      User ID:
                    </span>
                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                      {currentVolunteer?.user_id}
                    </span>
                  </div>
                  {currentVolunteer?.skills && (
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 dark:text-gray-400">
                        Skills:
                      </span>
                      <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-37.5">
                        {currentVolunteer.skills.length > 20
                          ? `${currentVolunteer.skills.slice(0, 20)}...`
                          : currentVolunteer.skills}
                      </span>
                    </div>
                  )}
                  {currentVolunteer?.availability && (
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500 dark:text-gray-400">
                        Availability:
                      </span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {currentVolunteer.availability}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                <svg
                  className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-[9px] text-amber-700 dark:text-amber-300">
                  This action is irreversible. All data associated with this
                  volunteer will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[9px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[9px] font-medium rounded-lg border border-red-600 hover:border-red-700 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Permanently
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

export default VolunteersTableOne;
