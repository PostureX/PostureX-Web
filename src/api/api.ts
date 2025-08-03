import axios from "axios";
import { apiURL } from "@/config/Config";

// Create an axios instance
const api = axios.create({
  baseURL: `${apiURL}`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith("http")) {
      // Remove baseURL for external requests
      config.baseURL = undefined;
      return config;
    }

    if (config.url?.startsWith("/auth")) {
      return config; // Skip auth routes
    }

    // prefix /api for all other routes
    if (!config.url?.startsWith("/api")) {
      config.url = `/api${config.url}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;