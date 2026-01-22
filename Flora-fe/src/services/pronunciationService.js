import api from "./api";

export const pronunciationService = {
  /**
   * Get instructions for a group
   */
  getInstructions: async (groupId) => {
    const response = await api.get(`/pronunciation/instructions/${groupId}`);
    return response.data;
  },

  /**
   * Submit pronunciation assessment
   */
  assessPronunciation: async (
    audioFile,
    instructionId,
    customText,
    sessionId
  ) => {
    const formData = new FormData();
    formData.append("audio_file", audioFile);
    formData.append("session_id", sessionId);

    if (instructionId) {
      formData.append("instruction_id", instructionId);
    }
    if (customText) {
      formData.append("custom_text", customText);
    }

    const response = await api.post("/pronunciation/assess", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get pronunciation recommendations
   */
  getRecommendations: async (groupId = null, excludeInstructionId = null, limit = 5) => {
    const params = { limit };
    if (groupId) params.group_id = groupId;
    if (excludeInstructionId) params.exclude_instruction_id = excludeInstructionId;

    const response = await api.get("/pronunciation/recommendations", {
      params,
    });
    return response.data;
  },
};
