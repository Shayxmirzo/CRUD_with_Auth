import axios from "axios";
import Cookies from "js-cookie";

const Base_Url = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: Base_Url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("401 Unauthorized");
    }

    if (status === 403) {
      console.warn("403 Forbidden");
    }

    if (status === 404) {
      console.warn("404 Not Found");
    }

    if (status === 500) {
      console.error("500 Server Error");
    }

    return Promise.reject(error);
  }
);

export default api;