// Base API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// Error types
export const ERROR_TYPES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
};

// User roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Audio constraints
export const AUDIO_CONSTRAINTS = {
  MAX_DURATION: 30, // seconds
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

// Quiz settings
export const QUIZ_SETTINGS = {
  QUESTIONS_PER_QUIZ: 10,
};

// Score thresholds
export const SCORE_THRESHOLDS = {
  MASTERED: 90,
  PRACTICING: 70,
};
