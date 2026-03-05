import axios from "axios";

const BASE_URL = "http://localhost:5000/api/volunteers";

export interface Volunteer {
  id: number;
  user_id: number;
  skills: string;
  availability: string;
  joined_date: string;
  full_name?: string; // This will be populated from users table
  email?: string;
  phone?: string;
}

interface BackendResponse {
  success: boolean;
  count?: number;
  data: Volunteer | Volunteer[];
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

export const getAllVolunteers = async (): Promise<Volunteer[]> => {
  try {
    const res = await api.get<BackendResponse>("/");
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    throw error;
  }
};

export const getVolunteerById = async (id: number): Promise<Volunteer> => {
  const res = await api.get<BackendResponse>(`/${id}`);
  if (res.data.success && res.data.data) {
    return res.data.data as Volunteer;
  }
  throw new Error("Volunteer not found");
};

export const getVolunteerByUserId = async (userId: number): Promise<Volunteer> => {
  const res = await api.get<BackendResponse>(`/user/${userId}`);
  if (res.data.success && res.data.data) {
    return res.data.data as Volunteer;
  }
  throw new Error("Volunteer not found");
};