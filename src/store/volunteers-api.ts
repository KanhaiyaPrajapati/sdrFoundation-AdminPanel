import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
const BASE_URL = "http://192.168.1.8:5000/api";
const VOLUNTEERS_URL = `${BASE_URL}/volunteers`;
const USERS_URL = `${BASE_URL}/users`;
export interface Volunteer {
  name: string;
  id?: number | string;
  user_id: number | string;
  skills: string;
  availability: string;
  joined_date: string;
  created_at?: string;
  updated_at?: string;
  phone?: string;
}

export interface User {
  id: number | string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
  statusCode?: number;
}
const volunteersApi: AxiosInstance = axios.create({
  baseURL: VOLUNTEERS_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const usersApi: AxiosInstance = axios.create({
  baseURL: USERS_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

volunteersApi.interceptors.request.use(
  (config) => {
    console.log(`🚀 Volunteers API ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Volunteers API request error:", error);
    return Promise.reject(error);
  }
);

volunteersApi.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ Volunteers API response received:", response.status);
    console.log("Response data:", response.data);
    return response;
  },
  (error: AxiosError<ApiError>) => {
    handleApiErrorInterceptor(error, "Volunteers API");
    return Promise.reject(error);
  }
);

usersApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    handleApiErrorInterceptor(error, "Users API");
    return Promise.reject(error);
  }
);

const handleApiErrorInterceptor = (error: AxiosError<ApiError>, apiName: string) => {
  if (error.code === 'ECONNABORTED') {
    console.error(`⏰ ${apiName} request timeout - server not responding`);
  } else if (error.response) {
    console.error(`❌ ${apiName} server error ${error.response.status}:`, error.response.data);
  } else if (error.request) {
    console.error(`📡 ${apiName} no response received. Check if backend is running.`);
  } else {
    console.error(`⚙️ ${apiName} request setup error:`, error.message);
  }
};
const extractData = <T>(response: AxiosResponse): T => {
  const data = response.data;
  console.log("Extracting data from response:", data);
  if (data && typeof data === 'object') {
    if ('data' in data) {
      return (data as ApiResponse<T>).data as T;
    }
    return data as T;
  }
  
  return data as T;
};
const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response) {
      const errorMessage = axiosError.response.data?.message || 
                          axiosError.response.data?.error || 
                          `Server error: ${axiosError.response.status}`;
      throw new Error(errorMessage);
    } else if (axiosError.request) {
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    } else if (axiosError.code === 'ECONNABORTED') {
      throw new Error("Request timeout. Server is not responding.");
    }
  }
  
  throw new Error(defaultMessage);
};
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// ==================== User Validation Functions ====================

export const checkUserExists = async (userId: string | number): Promise<boolean> => {
  try {
    console.log(`🔍 Checking if user ${userId} exists...`);
    
    const userIdStr = String(userId).trim();
    
    if (!userIdStr) {
      throw new Error("User ID is required");
    }
    const response = await usersApi.get<ApiResponse<User>>(`/${userIdStr}`);
    console.log(`✅ User ${userId} exists:`, response.status === 200);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log(`❌ User ${userId} does not exist`);
      return false;
    }
    console.error(`Error checking user ${userId}:`, error);
    return false;
  }
};
export const getUserById = async (userId: string | number): Promise<User | null> => {
  try {
    const userIdStr = String(userId).trim();
    
    if (!userIdStr) {
      throw new Error("User ID is required");
    }
    
    const response = await usersApi.get<ApiResponse<User>>(`/${userIdStr}`);
    
    const userData = extractData<User>(response);
    
    return userData || null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
};

export const validateMultipleUsers = async (userIds: (string | number)[]): Promise<Record<string, boolean>> => {
  const results: Record<string, boolean> = {};
  
  const checks = userIds.map(async (id) => {
    const idStr = String(id);
    try {
      const exists = await checkUserExists(idStr);
      results[idStr] = exists;
    } catch {
      results[idStr] = false;
    }
  });
  
  await Promise.allSettled(checks);
  return results;
};

// ==================== Volunteer API Functions ====================
export const getAllVolunteers = async (): Promise<Volunteer[]> => {
  try {
    console.log("📋 Fetching all volunteers from:", VOLUNTEERS_URL);
    const response = await volunteersApi.get("/");
    console.log("Raw response:", response);
    
    const volunteers = extractData<Volunteer[]>(response);
    console.log(`✅ Fetched ${volunteers.length} volunteers:`, volunteers);
    return volunteers;
  } catch (error) {
    console.error("Failed to fetch volunteers:", error);
    return handleApiError(error, "Failed to load volunteers");
  }
};
export const getVolunteerByUserId = async (userId: string | number): Promise<Volunteer> => {
  try {
    console.log(`🔍 Fetching volunteer with user ID: ${userId}`);
    const response = await volunteersApi.get(`/${userId}`);
    console.log("Raw response:", response);
    
    const volunteer = extractData<Volunteer>(response);
    console.log("✅ Volunteer found:", volunteer);
    return volunteer;
  } catch (error) {
    console.error(`Failed to fetch volunteer with user ID ${userId}:`, error);
    return handleApiError(error, `Failed to fetch volunteer with user ID ${userId}`);
  }
};
export const getVolunteerById = async (id: string | number): Promise<Volunteer> => {
  try {
    console.log(`🔍 Fetching volunteer with ID: ${id}`);
    const response = await volunteersApi.get(`/id/${id}`);
    console.log("Raw response:", response);
    
    const volunteer = extractData<Volunteer>(response);
    console.log("✅ Volunteer found:", volunteer);
    return volunteer;
  } catch (error) {
    console.error(`Failed to fetch volunteer with ID ${id}:`, error);
    return handleApiError(error, `Failed to fetch volunteer with ID ${id}`);
  }
};

export const createVolunteer = async (
  data: Omit<Volunteer, 'id' | 'created_at' | 'updated_at'>
): Promise<Volunteer> => {
  try {
    console.log("➕ Creating new volunteer with data:", data);
    
    if (!data.user_id) throw new Error("User ID is required");
    if (!data.skills) throw new Error("Skills are required");
    if (!data.availability) throw new Error("Availability is required");
    if (!data.joined_date) throw new Error("Joined date is required");
    
    const userExists = await checkUserExists(data.user_id);
    if (!userExists) {
      throw new Error(`User ID ${data.user_id} is not registered in the system`);
    }
    
    const response = await volunteersApi.post("/", data);
    console.log("Create response:", response);
    
    const volunteer = extractData<Volunteer>(response);
    console.log("✅ Volunteer created successfully:", volunteer);
    return volunteer;
  } catch (error) {
    console.error("Failed to create volunteer:", error);
    return handleApiError(error, "Failed to create volunteer");
  }
};
export const updateVolunteerPut = async (
  id: string | number, 
  data: Volunteer
): Promise<Volunteer> => {
  try {
    console.log(`✏️ Updating volunteer ${id} with data:`, data);
    
    if (!id) throw new Error("Volunteer ID is required for update");
    
    const response = await volunteersApi.put(`/${id}`, data);
    console.log("Update response:", response);
    
    const volunteer = extractData<Volunteer>(response);
    console.log("✅ Volunteer updated successfully:", volunteer);
    return volunteer;
  } catch (error) {
    console.error(`Failed to update volunteer ${id}:`, error);
    return handleApiError(error, "Failed to update volunteer");
  }
};
export const updateVolunteerPatch = async (
  id: string | number, 
  data: Partial<Volunteer>
): Promise<Volunteer> => {
  try {
    console.log(`✏️ Partially updating volunteer ${id} with data:`, data);
    
    if (!id) throw new Error("Volunteer ID is required for update");
    
    if (data.user_id) {
      const userExists = await checkUserExists(data.user_id);
      if (!userExists) {
        throw new Error(`User ID ${data.user_id} is not registered in the system`);
      }
    }
    
    const response = await volunteersApi.patch(`/${id}`, data);
    console.log("Patch response:", response);
    
    const volunteer = extractData<Volunteer>(response);
    console.log("✅ Volunteer updated successfully:", volunteer);
    return volunteer;
  } catch (error) {
    console.error(`Failed to partially update volunteer ${id}:`, error);
    return handleApiError(error, "Failed to update volunteer");
  }
};
export const deleteVolunteer = async (id: string | number): Promise<void> => {
  try {
    console.log(`🗑️ Deleting volunteer with ID: ${id}`);
    
    if (!id) throw new Error("Volunteer ID is required for deletion");
    
    await volunteersApi.delete(`/${id}`);
    console.log("✅ Volunteer deleted successfully");
  } catch (error) {
    console.error(`Failed to delete volunteer ${id}:`, error);
    return handleApiError(error, "Failed to delete volunteer");
  }
};

// ==================== Utility Functions ====================

export const checkVolunteersServerHealth = async (): Promise<boolean> => {
  try {
    await volunteersApi.get("/", { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};

export const checkUsersServerHealth = async (): Promise<boolean> => {
  try {
    await usersApi.get("/", { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Network error";
  }
  return "An unknown error occurred";
};

export const searchVolunteers = (volunteers: Volunteer[], searchTerm: string): Volunteer[] => {
  if (!searchTerm.trim()) return volunteers;
  
  const term = searchTerm.toLowerCase().trim();
  
  return volunteers.filter((volunteer) => {
    const userIdStr = String(volunteer.user_id || '').toLowerCase();
    const skillsStr = String(volunteer.skills || '').toLowerCase();
    const availabilityStr = String(volunteer.availability || '').toLowerCase();
    
    return (
      userIdStr.includes(term) ||
      skillsStr.includes(term) ||
      availabilityStr.includes(term)
    );
  });
};
export default volunteersApi;