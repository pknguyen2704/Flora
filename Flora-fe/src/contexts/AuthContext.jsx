import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "~/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          // Token expired, clear it
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        } else {
          // Set user from token
          setUser({
            id: decoded.sub,
            username: decoded.username,
            role: decoded.role,
            full_name: decoded.full_name,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authService.login(username, password);

    if (response.success) {
      const { access_token, refresh_token, user: userData } = response.data;

      // Store tokens
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Set user state
      const userInfo = {
        id: userData.id,
        username: userData.username,
        role: userData.role,
        full_name: userData.full_name,
      };

      setUser(userInfo);

      // Return user data for redirect logic
      return userInfo;
    }

    throw new Error(response.message || "Login failed");
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => !!user;

  const isAdmin = () => user?.role === "admin";

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
