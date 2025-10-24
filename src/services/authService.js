import api from "./api";

// method 4 asyn function handle API calls

export const authService = {
  // register new user
  register: async (userData) => {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // user login
  login: async (credentials) => {
    try {
      const response = await api.post("/login", credentials)
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // logout user
  logout: async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // get user profile
  getProfile: async () => {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}