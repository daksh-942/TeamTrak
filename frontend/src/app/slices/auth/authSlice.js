import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./authThunks";

const initialState = {
  user: null,
  error: null,
  fieldErrors: {},
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.fieldErrors = {};
      state.loading = "idle";
    },
    setCurrentUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER USER
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.fieldErrors = {};
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.fieldErrors = {};
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || null;
        state.fieldErrors = action.payload?.fieldErrors || {};
      })
      // LOGIN USER
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.fieldErrors = {};
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || null;
        state.fieldErrors = action.payload?.fieldErrors || {};
      })
      // FETCH_CURRENT_USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      // LOGOUT_USER
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { clearErrors, logout, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
