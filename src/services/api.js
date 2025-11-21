import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// method 2 request interceptor - attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// method 3 response interceptor - handle common errors

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // token expired or unauthorized
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;