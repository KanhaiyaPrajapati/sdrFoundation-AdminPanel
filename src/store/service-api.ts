
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/services";

export interface Service {
  id?: string | number;  // ✅ Allow both string and number
  service_name: string;
  description: string;
  category: string;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

// Backend actual response structure
interface BackendResponse {
  success: boolean;
  count?: number;
  data: Service | Service[];
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

export const getAllServices = async (): Promise<Service[]> => {
  try {
    const res = await api.get<BackendResponse>("/");
    console.log("API Response:", res.data); // For debugging
    
    // Handle different response structures
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (Array.isArray(res.data)) {
      return res.data;
    } else {
      console.warn("Unexpected API response format:", res.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getServiceById = async (id: string | number): Promise<Service> => {
  const res = await api.get<BackendResponse>(`/${id}`);
  if (res.data.success && res.data.data) {
    return res.data.data as Service;
  }
  throw new Error("Service not found");
};

export const createService = async (data: Service): Promise<Service> => {
  const res = await api.post<BackendResponse>("/", data);
  console.log("Create response:", res.data); // For debugging
  
  if (res.data.success && res.data.data) {
    return res.data.data as Service;
  }
  throw new Error(res.data.message || "Failed to create service");
};

export const updateServicePut = async (
  id: string | number,
  data: Service
): Promise<Service> => {
  const res = await api.put<BackendResponse>(`/${id}`, data);
  
  if (res.data.success) {
    // If updated successfully, fetch the updated service
    const updated = await getServiceById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to update service");
};

export const updateServicePatch = async (
  id: string | number,
  data: Partial<Service>
): Promise<Service> => {
  const res = await api.patch<BackendResponse>(`/${id}`, data);
  
  if (res.data.success) {
    const updated = await getServiceById(id);
    return updated;
  }
  throw new Error(res.data.message || "Failed to update service");
};

export const deleteService = async (id: string | number): Promise<void> => {
  const res = await api.delete<BackendResponse>(`/${id}`);
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to delete service");
  }
};