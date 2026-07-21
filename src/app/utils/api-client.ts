import axios from "axios";
import "dotenv/config";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_SERVER_ENV === "local"
      ? "http://localhost:8080"
      : "https://digihamster-api.duckdns.org",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
