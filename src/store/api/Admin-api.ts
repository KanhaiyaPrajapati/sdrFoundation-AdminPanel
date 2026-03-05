import axios, { AxiosError } from "axios";

export interface Admin {
  id?: number;
  name: string;
  email: string;
  role: string;
  password?: string;
}

const api = axios.create({
  baseURL: "http://192.168.1.8:5000/api/admins",
  headers: { "Content-Type": "application/json" },
});

// Helper to extract error message from unknown error
const handleApiError = (error: unknown, action: string): never => {
  const err = error as AxiosError<{ message?: string }>;
  const message = err.response?.data?.message || err.message || "Server error";
  console.error(`❌ Admin API error while ${action}:`, message);
  throw new Error(message);
};

export const adminService = {
  async getAllAdmins(): Promise<Admin[]> {
    try {
      const res = await api.get("/");
      // If response is directly an array, return it; otherwise assume it's wrapped in a 'data' property
      return Array.isArray(res.data) ? res.data : (res.data as { data?: Admin[] })?.data || [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Silently return empty array on fetch error (as before)
      return [];
    }
  },

  async createAdmin(data: Admin): Promise<Admin> {
    try {
      const res = await api.post("/register", data);
      return res.data;
    } catch (error) {
      return handleApiError(error, "registering admin");
    }
  },

  async patchAdmin(id: number, data: Partial<Admin>): Promise<Admin> {
    try {
      const res = await api.patch(`/${id}`, data);
      return res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn("PATCH failed, attempting PUT fallback...");
      try {
        const res = await api.put(`/${id}`, data);
        return res.data;
      } catch (fallbackError) {
        return handleApiError(fallbackError, `updating admin ${id}`);
      }
    }
  },

  async deleteAdmin(id: number): Promise<void> {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      return handleApiError(error, `deleting admin ${id}`);
    }
  },
};



