import axios from "axios";

/**
 * Shared Axios instance for all API calls.
 * Automatically injects the Bearer token from localStorage on every request.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

// Request interceptor — attach auth token if present
apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("dealerToken") ?? localStorage.getItem("adminToken") ?? "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
