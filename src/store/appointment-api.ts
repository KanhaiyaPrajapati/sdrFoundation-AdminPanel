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
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  volunteer_name?: string;
  volunteer_skills?: string;
}

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Request failed");
  }
);

export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await api.get<BackendResponse>("/");
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const getAppointmentById = async (id: string | number): Promise<Appointment> => {
  const res = await api.get<BackendResponse>(`/${id}`);
  if (res.data.success && res.data.data) {
    return res.data.data as Appointment;
  }
  throw new Error("Appointment not found");
};

export const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  const res = await api.post<BackendResponse>("/", data);
  if (res.data.success && res.data.data) {
    return res.data.data as Appointment;
  }
  throw new Error(res.data.message || "Failed to create appointment");
};

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

export const deleteAppointment = async (id: string | number): Promise<void> => {
  const res = await api.delete<BackendResponse>(`/${id}`);
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to delete appointment");
  }
};