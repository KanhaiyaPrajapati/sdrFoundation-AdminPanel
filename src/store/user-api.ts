import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users";

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user_type: "senior" | "newcomer" | "volunteer";
  status: "active" | "inactive" | "suspended";
  created_at?: string;
}

interface BackendResponse {
  success: boolean;
  count?: number;
  data: User | User[];
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

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get<BackendResponse>("/");
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id: number): Promise<User> => {
  const res = await api.get<BackendResponse>(`/${id}`);
  if (res.data.success && res.data.data) {
    return res.data.data as User;
  }
  throw new Error("User not found");
};