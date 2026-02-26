import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
      state.error = null;
    },
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setGroups, setCurrentGroup, setLoading, setError, clearError } =
  groupSlice.actions;

export default groupSlice.reducer;

// Selectors
export const selectGroups = (state) => state.group.groups;
export const selectCurrentGroup = (state) => state.group.currentGroup;
export const selectGroupLoading = (state) => state.group.loading;
export const selectGroupError = (state) => state.group.error;
