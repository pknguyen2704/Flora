import api from "./api";

export const situationService = {
  /**
   * Start a new quiz
   */
  startQuiz: async (groupId) => {
    const response = await api.get(`/situations/quiz/${groupId}`);
    return response.data;
  },

  /**
   * Submit quiz answers
   */
  submitQuiz: async (quizId, answers) => {
    const response = await api.post("/situations/submit", {
      quiz_id: quizId,
      answers,
    });
    return response.data;
  },
};
