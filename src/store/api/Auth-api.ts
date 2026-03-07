import axios, { AxiosError } from "axios";

export interface Admin {
  id?: number;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface LoginResponse {
  message: string;
  user: Admin;
  token?: string; 
}

const API_BASE_URL = "http://192.168.1.8:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const handleApiError = (error: unknown, action: string): never => {
  const err = error as AxiosError<{ message?: string }>;
  const message = err.response?.data?.message || err.message || "Server error";
  console.error(`❌ API error while ${action}:`, message);
  throw new Error(message);
};

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const res = await api.post("/admins/login", { email, password });
      return res.data;
    } catch (error) {
      return handleApiError(error, "logging in");
    }
  }
};