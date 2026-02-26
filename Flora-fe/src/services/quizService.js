import api from "./api";

export const quizService = {
  /**
   * Get all quiz questions
   */
  getAll: async () => {
    const response = await api.get("/quiz/all");
    return response.data;
  },

  /**
   * Get random quiz questions
   */
  getRandom: async (limit = 10) => {
    const response = await api.get(`/quiz/random?limit=${limit}`);
    return response.data;
  },

  /**
   * Submit quiz answers
   */
  submit: async (submission) => {
    const response = await api.post("/quiz/submit", submission);
    return response.data;
  },
};
