import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/users/register", formData);
      return res.data.user;
    } catch (error) {
      const status = error.status;
      if (status === 422) {
        return thunkAPI.rejectWithValue({
          fieldErrors: error.response.data?.errorData,
        });
      }

      return thunkAPI.rejectWithValue({
        error: error.response.data?.message || "Registration failed",
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/users/login", formData);
      return res.data.user;
    } catch (error) {
      const status = error.status;
      if (status === 422) {
        return thunkAPI.rejectWithValue({
          fieldErrors: error.response.data?.errorData,
        });
      }

      return thunkAPI.rejectWithValue({
        error: error.response.data?.message || "Login failed",
      });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/users/profile");
      return res.data.user;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.post("/users/logout");
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
