import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;
      state.user = user;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      state.isAuthenticated = true;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateTokens: (state, action) => {
      const { access_token, refresh_token } = action.payload;
      state.accessToken = access_token;
      if (refresh_token) {
        state.refreshToken = refresh_token;
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCredentials,
  setUser,
  updateTokens,
  logout,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
