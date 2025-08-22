import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const createTeam = createAsyncThunk(
  "team/createTeanm",
  async (team, thunkApi) => {
    try {
      const res = await api.post("/teams", team);
      return res.data.data;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllTeams = createAsyncThunk(
  "team/getAllTeams",
  async (_, thunkApi) => {
    try {
      const res = await api.get("/teams");
      return res.data.data;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);
