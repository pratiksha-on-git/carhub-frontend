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
  const url = config.url ?? "";
  // Pick token based on API path — admin APIs use adminToken, dealer APIs use dealerToken
  const isAdminApi = url.includes("/api/admin");
  const token = isAdminApi
    ? (localStorage.getItem("adminToken") ?? "")
    : (localStorage.getItem("dealerToken") ?? localStorage.getItem("adminToken") ?? "");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
