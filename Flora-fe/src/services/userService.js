import axios from "axios";

import { API_BASE_URL } from "../utils/constants";
// API_BASE_URL = "/api/v1"


const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/users/${userId}`,
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
      `${API_BASE_URL}/admin/users/${userId}`,
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
      `${API_BASE_URL}/admin/users/${userId}/toggle-admin`,
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
      `${API_BASE_URL}/admin/users`,
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
      `${API_BASE_URL}/admin/users/${userId}/stats`,
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
      `${API_BASE_URL}/admin/dashboard/stats`,
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
      `${API_BASE_URL}/admin/content/groups`,
      groupData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  updateGroup: async (groupId, groupData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/content/groups/${groupId}`,
      groupData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  deleteGroup: async (groupId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${API_BASE_URL}/admin/content/groups/${groupId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Instructions
  getAdminInstructions: async (groupId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/content/instructions`,
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
      `${API_BASE_URL}/admin/content/instructions`,
      instructionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  updateInstruction: async (id, instructionData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/content/instructions/${id}`,
      instructionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  deleteInstruction: async (id) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${API_BASE_URL}/admin/content/instructions/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Situations
  getAdminSituations: async (groupId) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/content/situations`,
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
      `${API_BASE_URL}/admin/content/situations`,
      situationData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  updateSituation: async (id, situationData) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/content/situations/${id}`,
      situationData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  deleteSituation: async (id) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${API_BASE_URL}/admin/content/situations/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // General Fetch (Authenticated)
  getGroups: async () => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_BASE_URL}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default userService;
