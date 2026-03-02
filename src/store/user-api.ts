import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users";

export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status?: "active" | "inactive";
  created_at?: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: User[];
}

interface SingleApiResponse {
  success: boolean;
  data: User;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get<ApiResponse>("/");
    const users = res.data.data || [];
    return users.map(user => ({
      ...user,
      id: user.id?.toString()
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (id: string | number): Promise<User | null> => {
  try {
    const res = await api.get<SingleApiResponse>(`/${id}`);
    const user = res.data.data;
    return {
      ...user,
      id: user.id?.toString()
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const createUser = async (data: Partial<User>): Promise<User | null> => {
  try {
    const res = await api.post<SingleApiResponse>("/", data);
    const user = res.data.data;
    return {
      ...user,
      id: user.id?.toString()
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const updateUser = async (id: string | number, data: Partial<User>): Promise<User | null> => {
  try {
    const res = await api.put<SingleApiResponse>(`/${id}`, data);
    const user = res.data.data;
    return {
      ...user,
      id: user.id?.toString()
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const deleteUser = async (id: string | number): Promise<boolean> => {
  try {
    await api.delete(`/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};