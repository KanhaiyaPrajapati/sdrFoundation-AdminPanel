import axios from "axios";

const BASE_URL = "http://localhost:5000/api/volunteers";

export interface Volunteer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  availability?: string;
  status?: "active" | "inactive";
  created_at?: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Volunteer[];
}

interface SingleApiResponse {
  success: boolean;
  data: Volunteer;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllVolunteers = async (): Promise<Volunteer[]> => {
  try {
    const res = await api.get<ApiResponse>("/");
    const volunteers = res.data.data || [];
    return volunteers.map(volunteer => ({
      ...volunteer,
      id: volunteer.id?.toString()
    }));
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return [];
  }
};

export const getVolunteerById = async (id: string | number): Promise<Volunteer | null> => {
  try {
    const res = await api.get<SingleApiResponse>(`/${id}`);
    const volunteer = res.data.data;
    return {
      ...volunteer,
      id: volunteer.id?.toString()
    };
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return null;
  }
};

export const createVolunteer = async (data: Partial<Volunteer>): Promise<Volunteer | null> => {
  try {
    const res = await api.post<SingleApiResponse>("/", data);
    const volunteer = res.data.data;
    return {
      ...volunteer,
      id: volunteer.id?.toString()
    };
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return null;
  }
};

export const updateVolunteer = async (id: string | number, data: Partial<Volunteer>): Promise<Volunteer | null> => {
  try {
    const res = await api.put<SingleApiResponse>(`/${id}`, data);
    const volunteer = res.data.data;
    return {
      ...volunteer,
      id: volunteer.id?.toString()
    };
  } catch (error) {
    console.error("Error updating volunteer:", error);
    return null;
  }
};

export const deleteVolunteer = async (id: string | number): Promise<boolean> => {
  try {
    await api.delete(`/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    return false;
  }
};