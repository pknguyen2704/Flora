import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  severity: "info", // 'success' | 'error' | 'warning' | 'info'
  open: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      const { message, severity = "info" } = action.payload;
      state.message = message;
      state.severity = severity;
      state.open = true;
    },
    hideNotification: (state) => {
      state.open = false;
    },
    clearNotification: (state) => {
      state.message = null;
      state.severity = "info";
      state.open = false;
    },
  },
});

export const { showNotification, hideNotification, clearNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;

// Selectors
export const selectNotification = (state) => state.notification;
