import axios from "axios";

const BASE_URL = "http://192.168.1.20:5000/api/donations";

export interface Donation {
  id?: string | number;
  donor_name: string;
  email: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  donation_date?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string | number | null;
}

// Backend response structure
interface BackendResponse {
  success: boolean;
  count?: number;
  data: Donation | Donation[];
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
// GET ALL DONATIONS
// ===========================================
export const getAllDonations = async (): Promise<Donation[]> => {
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
    console.error("Error fetching donations:", error);
    throw error;
  }
};

// ===========================================
// GET DONATION BY ID
// ===========================================
export const getDonationById = async (id: string | number): Promise<Donation> => {
  const res = await api.get<BackendResponse>(`/${id}`);
  if (res.data.success && res.data.data) {
    return res.data.data as Donation;
  }
  throw new Error("Donation not found");
};

// ===========================================
// GET DONATIONS BY EMAIL
// ===========================================
export const getDonationsByEmail = async (email: string): Promise<Donation[]> => {
  try {
    const res = await api.get<BackendResponse>(`/email/${email}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching donations by email:", error);
    throw error;
  }
};

// ===========================================
// GET DONATIONS BY STATUS
// ===========================================
export const getDonationsByStatus = async (status: string): Promise<Donation[]> => {
  try {
    const res = await api.get<BackendResponse>(`/status/${status}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching donations by status:", error);
    throw error;
  }
};

// ===========================================
// GET DONATIONS BY DATE RANGE
// ===========================================
export const getDonationsByDateRange = async (startDate: string, endDate: string): Promise<Donation[]> => {
  try {
    const res = await api.get<BackendResponse>(`/range?startDate=${startDate}&endDate=${endDate}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching donations by date range:", error);
    throw error;
  }
};

// ===========================================
// GET TODAY'S DONATIONS
// ===========================================
export const getTodaysDonations = async (): Promise<Donation[]> => {
  try {
    const res = await api.get<BackendResponse>("/today");
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching today's donations:", error);
    throw error;
  }
};

// ===========================================
// GET DONATION STATISTICS
// ===========================================
export const getDonationStats = async (): Promise<any> => {
  try {
    const res = await api.get<BackendResponse>("/stats");
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching donation stats:", error);
    throw error;
  }
};

// ===========================================
// GET MONTHLY SUMMARY
// ===========================================
export const getMonthlySummary = async (year: number): Promise<any[]> => {
  try {
    const res = await api.get<BackendResponse>(`/monthly/${year}`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    throw error;
  }
};

// ===========================================
// CREATE DONATION
// ===========================================
export const createDonation = async (data: Partial<Donation>): Promise<Donation> => {
  const res = await api.post<BackendResponse>("/", data);
  console.log("Create response:", res.data);
  
  if (res.data.success && res.data.data) {
    return res.data.data as Donation;
  }
  throw new Error(res.data.message || "Failed to create donation");
};

// ===========================================
// REGISTER DONATION (with validation)
// ===========================================
export const registerDonation = async (data: Partial<Donation>): Promise<Donation> => {
  const res = await api.post<BackendResponse>("/register", data);
  
  if (res.data.success && res.data.data) {
    return res.data.data as Donation;
  }
  throw new Error(res.data.message || "Failed to register donation");
};

// ===========================================
// UPDATE DONATION (PUT)
// ===========================================
export const updateDonationPut = async (
  id: string | number,
  data: Partial<Donation>
): Promise<Donation> => {
  const res = await api.put<BackendResponse>(`/${id}`, data);
  
  if (res.data.success) {
    const updated = await getDonationById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to update donation");
};

// ===========================================
// PARTIAL UPDATE DONATION (PATCH)
// ===========================================
export const updateDonationPatch = async (
  id: string | number,
  data: Partial<Donation>
): Promise<Donation> => {
  const res = await api.patch<BackendResponse>(`/${id}`, data);
  
  if (res.data.success) {
    const updated = await getDonationById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to update donation");
};

// ===========================================
// UPDATE DONATION STATUS
// ===========================================
export const updateDonationStatus = async (
  id: string | number,
  status: string
): Promise<Donation> => {
  const res = await api.patch<BackendResponse>(`/${id}/status`, { status });
  
  if (res.data.success) {
    const updated = await getDonationById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to update donation status");
};

// ===========================================
// ASSIGN DONATION TO USER
// ===========================================
export const assignDonationToUser = async (
  id: string | number,
  user_id: string | number
): Promise<Donation> => {
  const res = await api.patch<BackendResponse>(`/${id}/assign-user`, { user_id });
  
  if (res.data.success) {
    const updated = await getDonationById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to assign donation to user");
};

// ===========================================
// DELETE DONATION
// ===========================================
export const deleteDonation = async (id: string | number): Promise<void> => {
  const res = await api.delete<BackendResponse>(`/${id}`);
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to delete donation");
  }
};