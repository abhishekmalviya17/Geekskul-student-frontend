import axios from "axios";

const fallbackBaseUrl = import.meta.env?.DEV
  ? "http://localhost:5001/api"
  : "https://api.geekskul.com/v1";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl,
  timeout: 1000 * 20,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined"
    ? window.localStorage.getItem("geekskul_student_token")
    : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("geekskul_student_token");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
