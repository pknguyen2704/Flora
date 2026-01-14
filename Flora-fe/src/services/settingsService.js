import api from "./api";

export const settingsService = {
  /**
   * Update user profile
   */
  updateProfile: async (data) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data) => {
    const response = await api.put("/auth/password", data);
    return response.data;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (data) => {
    const response = await api.put("/auth/preferences", data);
    return response.data;
  },
};
