import api from "./api";

export const dashboardService = {
  /**
   * Get user statistics
   */
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  /**
   * Get group progress
   */
  getGroupProgress: async (groupId) => {
    const response = await api.get(`/dashboard/progress/${groupId}`);
    return response.data;
  },

  /**
   * Get user profile data
   */
  getUserProfile: async () => {
    const response = await api.get("/dashboard/profile");
    return response.data;
  },
};
