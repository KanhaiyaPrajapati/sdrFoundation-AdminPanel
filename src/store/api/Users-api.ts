import axios, { AxiosError } from 'axios';

// Base URL for all user-related endpoints
const BASE_URL = "http://192.168.1.8:5000/api/users";
const REGISTER_URL = `${BASE_URL}/register`;

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Helper to handle errors consistently
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    // Try to extract server error message
    const serverMessage = axiosError.response?.data?.message;
    const status = axiosError.response?.status;
    throw new Error(serverMessage || `Request failed with status ${status || 'unknown'}`);
  }
  throw new Error('An unexpected error occurred');
};

/**
 * GET: Fetch all users
 */
export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/'); // GET /api/users
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * POST: Add a new user (uses the register endpoint)
 */
export const addUser = async (userData: unknown) => {
  try {
    // Note: using full URL because REGISTER_URL is outside baseURL
    const response = await axios.post(REGISTER_URL, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * PUT: Update an existing user
 */
export const updateUser = async (id: number, userData: unknown) => {
  try {
    const response = await api.put(`/${id}`, userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * DELETE: Remove a user
 */
export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


