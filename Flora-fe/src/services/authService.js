import api from "./api";

export const authService = {
  /**
   * Login user
   */
  login: async (username, password) => {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
