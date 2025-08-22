import { createSlice } from "@reduxjs/toolkit";
import { createTeam, getAllTeams } from "./teamThunk";

const initialState = {
  teams: [],
  currentTeam: null,
  error: null,
  isCreating: false,
  loading: false,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    getCurrentTeam: (state, action) => {
      const team = state.teams.find((team) => team._id === action.payload);
      state.currentTeam = team;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isCreating = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      .addCase(getAllTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(getAllTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { getCurrentTeam } = teamSlice.actions;
export default teamSlice.reducer;
