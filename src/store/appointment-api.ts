
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/appointments";

export interface Appointment {
  id?: string | number;
  user_id: string | number;
  volunteer_id: string | number;
  appointment_date: string;
  appointment_time: string;
  status: "Pending" | "Approved" | "Completed" | "Cancelled" | "Rescheduled";
  created_at?: string;
  updated_at?: string;
  // Joined fields from API
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  volunteer_name?: string;
  volunteer_skills?: string;
}

// Backend response structure
interface BackendResponse {
  success: boolean;
  count?: number;
  data: Appointment | Appointment[];
  message?: string;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
);

// ===========================================
// GET ALL APPOINTMENTS
// ===========================================
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await api.get<BackendResponse>("/");
    console.log("API Response:", res.data);
    
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (Array.isArray(res.data)) {
      return res.data;
    } else {
      console.warn("Unexpected API response format:", res.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// ===========================================
// GET APPOINTMENT BY ID
// ===========================================
export const getAppointmentById = async (id: string | number): Promise<Appointment> => {
  const res = await api.get<BackendResponse>(`/${id}`);
  if (res.data.success && res.data.data) {
    return res.data.data as Appointment;
  }
  throw new Error("Appointment not found");
};

// ===========================================
// GET APPOINTMENTS BY USER ID
// ===========================================
export const getAppointmentsByUserId = async (userId: string | number): Promise<Appointment[]> => {
  try {
    const res = await api.get<BackendResponse>(`/user/${userId}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw error;
  }
};

// ===========================================
// GET APPOINTMENTS BY VOLUNTEER ID
// ===========================================
export const getAppointmentsByVolunteerId = async (volunteerId: string | number): Promise<Appointment[]> => {
  try {
    const res = await api.get<BackendResponse>(`/volunteer/${volunteerId}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching volunteer appointments:", error);
    throw error;
  }
};

// ===========================================
// GET APPOINTMENTS BY DATE
// ===========================================
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  try {
    const res = await api.get<BackendResponse>(`/date/${date}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching appointments by date:", error);
    throw error;
  }
};

// ===========================================
// GET APPOINTMENTS BY STATUS
// ===========================================
export const getAppointmentsByStatus = async (status: string): Promise<Appointment[]> => {
  try {
    const res = await api.get<BackendResponse>(`/status/${status}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching appointments by status:", error);
    throw error;
  }
};

// ===========================================
// GET UPCOMING APPOINTMENTS
// ===========================================
export const getUpcomingAppointments = async (days: number = 7): Promise<Appointment[]> => {
  try {
    const res = await api.get<BackendResponse>(`/upcoming?days=${days}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw error;
  }
};

// ===========================================
// GET TODAY'S APPOINTMENTS
// ===========================================
export const getTodaysAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await api.get<BackendResponse>("/today");
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    throw error;
  }
};

// ===========================================
// CREATE APPOINTMENT
// ===========================================
export const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  const res = await api.post<BackendResponse>("/", data);
  console.log("Create response:", res.data);
  
  if (res.data.success && res.data.data) {
    return res.data.data as Appointment;
  }
  throw new Error(res.data.message || "Failed to create appointment");
};

// ===========================================
// REGISTER APPOINTMENT (with validation)
// ===========================================
export const registerAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  const res = await api.post<BackendResponse>("/register", data);
  
  if (res.data.success && res.data.data) {
    return res.data.data as Appointment;
  }
  throw new Error(res.data.message || "Failed to register appointment");
};

// ===========================================
// UPDATE APPOINTMENT (PUT)
// ===========================================
export const updateAppointmentPut = async (
  id: string | number,
  data: Partial<Appointment>
): Promise<Appointment> => {
  const res = await api.put<BackendResponse>(`/${id}`, data);
  
  if (res.data.success) {
    const updated = await getAppointmentById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to update appointment");
};

// ===========================================
// PARTIAL UPDATE APPOINTMENT (PATCH)
// ===========================================
export const updateAppointmentPatch = async (
  id: string | number,
  data: Partial<Appointment>
): Promise<Appointment> => {
  const res = await api.patch<BackendResponse>(`/${id}`, data);
  
  if (res.data.success) {
    const updated = await getAppointmentById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to update appointment");
};

// ===========================================
// UPDATE APPOINTMENT STATUS
// ===========================================
export const updateAppointmentStatus = async (
  id: string | number,
  status: string
): Promise<Appointment> => {
  const res = await api.patch<BackendResponse>(`/${id}/status`, { status });
  
  if (res.data.success) {
    const updated = await getAppointmentById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to update appointment status");
};

// ===========================================
// REASSIGN VOLUNTEER
// ===========================================
export const reassignVolunteer = async (
  id: string | number,
  volunteer_id: string | number
): Promise<Appointment> => {
  const res = await api.patch<BackendResponse>(`/${id}/reassign`, { volunteer_id });
  
  if (res.data.success) {
    const updated = await getAppointmentById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to reassign volunteer");
};

// ===========================================
// RESCHEDULE APPOINTMENT
// ===========================================
export const rescheduleAppointment = async (
  id: string | number,
  appointment_date: string,
  appointment_time: string
): Promise<Appointment> => {
  const res = await api.patch<BackendResponse>(`/${id}/reschedule`, {
    appointment_date,
    appointment_time
  });
  
  if (res.data.success) {
    const updated = await getAppointmentById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to reschedule appointment");
};

// ===========================================
// CANCEL APPOINTMENT
// ===========================================
export const cancelAppointment = async (id: string | number): Promise<Appointment> => {
  const res = await api.patch<BackendResponse>(`/${id}/cancel`);
  
  if (res.data.success) {
    const updated = await getAppointmentById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to cancel appointment");
};

// ===========================================
// COMPLETE APPOINTMENT
// ===========================================
export const completeAppointment = async (id: string | number): Promise<Appointment> => {
  const res = await api.patch<BackendResponse>(`/${id}/complete`);
  
  if (res.data.success) {
    const updated = await getAppointmentById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to complete appointment");
};

// ===========================================
// DELETE APPOINTMENT
// ===========================================
export const deleteAppointment = async (id: string | number): Promise<void> => {
  const res = await api.delete<BackendResponse>(`/${id}`);
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to delete appointment");
  }
};

// ===========================================
// GET APPOINTMENT STATISTICS
// ===========================================
export const getAppointmentStats = async (): Promise<any> => {
  try {
    const res = await api.get<BackendResponse>("/stats");
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching appointment stats:", error);
    throw error;
  }
};

// ===========================================
// GET VOLUNTEER WORKLOAD
// ===========================================
export const getVolunteerWorkload = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const res = await api.get<BackendResponse>(`/volunteer-workload?startDate=${startDate}&endDate=${endDate}`);
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching volunteer workload:", error);
    throw error;
  }
};

// ===========================================
// GET DAILY SUMMARY
// ===========================================
export const getDailySummary = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const res = await api.get<BackendResponse>(`/daily-summary?startDate=${startDate}&endDate=${endDate}`);
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    throw error;
  }
};