import React, { createContext, useState, useContext, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', 'info'
  });

  const showNotification = useCallback((message, severity = "info") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  const value = {
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
