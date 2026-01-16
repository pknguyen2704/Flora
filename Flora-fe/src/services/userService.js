import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_URL}/api/v1/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_URL}/api/v1/admin/users/${userId}`,
      userData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${API_URL}/api/v1/admin/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Toggle admin status (admin only)
  toggleAdmin: async (userId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_URL}/api/v1/admin/users/${userId}/toggle-admin`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Create user (admin only)
  createUser: async (userData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${API_URL}/api/v1/admin/users`,
      userData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get specific user stats (admin only)
  getUserStats: async (userId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${API_URL}/api/v1/admin/users/${userId}/stats`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get global dashboard stats (admin only)
  getGlobalStats: async () => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${API_URL}/api/v1/admin/dashboard/stats`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Content Management (Admin Only)

  // Groups
  createGroup: async (groupData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${API_URL}/api/v1/admin/content/groups`,
      groupData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  updateGroup: async (groupId, groupData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_URL}/api/v1/admin/content/groups/${groupId}`,
      groupData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  deleteGroup: async (groupId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${API_URL}/api/v1/admin/content/groups/${groupId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Instructions
  getAdminInstructions: async (groupId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${API_URL}/api/v1/admin/content/instructions`,
      {
        params: { group_id: groupId },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  createInstruction: async (instructionData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${API_URL}/api/v1/admin/content/instructions`,
      instructionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  updateInstruction: async (id, instructionData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_URL}/api/v1/admin/content/instructions/${id}`,
      instructionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  deleteInstruction: async (id) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${API_URL}/api/v1/admin/content/instructions/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Situations
  getAdminSituations: async (groupId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${API_URL}/api/v1/admin/content/situations`,
      {
        params: { group_id: groupId },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  createSituation: async (situationData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${API_URL}/api/v1/admin/content/situations`,
      situationData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  updateSituation: async (id, situationData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_URL}/api/v1/admin/content/situations/${id}`,
      situationData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  deleteSituation: async (id) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${API_URL}/api/v1/admin/content/situations/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // General Fetch (Authenticated)
  getGroups: async () => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_URL}/api/v1/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default userService;
