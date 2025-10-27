import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "guest",
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    loginSuccess(state, action) {
      const { user, token, refreshToken } = action.payload;
      state.status = "authenticated";
      state.user = user;
      state.token = token || null;
      state.refreshToken = refreshToken || null;
      state.loading = false;
      state.error = null;
      
      // Persist to localStorage
      if (token) {
        localStorage.setItem("geekskul_student_token", token);
      }
      if (refreshToken) {
        localStorage.setItem("geekskul_student_refresh_token", refreshToken);
      }
      if (user) {
        localStorage.setItem("geekskul_student_user", JSON.stringify(user));
      }
    },
    logout(state) {
      state.status = "guest";
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem("geekskul_student_token");
      localStorage.removeItem("geekskul_student_refresh_token");
      localStorage.removeItem("geekskul_student_user");
    },
    restoreAuthFromStorage(state) {
      // Called on app initialization to restore session from localStorage
      const token = localStorage.getItem("geekskul_student_token");
      const refreshToken = localStorage.getItem("geekskul_student_refresh_token");
      const userJson = localStorage.getItem("geekskul_student_user");
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          state.status = "authenticated";
          state.user = user;
          state.token = token;
          state.refreshToken = refreshToken || null;
          state.loading = false;
        } catch (error) {
          // If parsing fails, clear storage and stay logged out
          localStorage.removeItem("geekskul_student_token");
          localStorage.removeItem("geekskul_student_refresh_token");
          localStorage.removeItem("geekskul_student_user");
        }
      }
    },
    updateProfile(state, action) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      // Also update in localStorage
      localStorage.setItem("geekskul_student_user", JSON.stringify(state.user));
    },
  },
});

export const {
  setAuthLoading,
  setAuthError,
  loginSuccess,
  logout,
  updateProfile,
  restoreAuthFromStorage,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.status === "authenticated";

export default authSlice.reducer;
