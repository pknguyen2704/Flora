import api from "./api";

export const groupService = {
  /**
   * Get all groups
   */
  getAll: async () => {
    const response = await api.get("/groups");
    return response.data;
  },

  /**
   * Get single group with content
   */
  getById: async (groupId) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },
};
