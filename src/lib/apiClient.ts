import axios from "axios";

/**
 * Shared Axios instance for Dealer and Admin API calls.
 * Automatically injects the adminToken or dealerToken from localStorage.
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
    : (localStorage.getItem("dealerToken") ??
      localStorage.getItem("adminToken") ??
      "");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 Unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url ?? "";
      const isAdminApi = url.includes("/api/admin");
      window.dispatchEvent(
        new CustomEvent("auth-session-expired", {
          detail: { role: isAdminApi ? "admin" : "dealer" },
        }),
      );
    }
    return Promise.reject(error);
  },
);

export default apiClient;
