import { createSlice } from "@reduxjs/toolkit";
import {
  changeTaskStatus,
  createTask,
  getProjectTasks,
  getUserTasks,
} from "./taskThunk";
const initialState = {
  projectTasks: [],
  userTasks: [],
  loading: false,
  error: null,
  currentTask: null,
  isUpdatingStatus: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    getCurrentTask: (state, action) => {
      const taskId = action.payload;
      const task = state.userTasks.find((task) => task._id === taskId);
      state.currentTask = task;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET_USER_TASKS
      .addCase(getUserTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.userTasks = action.payload;
      })
      .addCase(getUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // PROJECT_TASKS
      .addCase(getProjectTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = action.payload;
      })
      .addCase(getProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CREATE_TASK
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CHANGE TASK STATUS
      .addCase(changeTaskStatus.pending, (state) => {
        state.isUpdatingStatus = true;
      })
      .addCase(changeTaskStatus.fulfilled, (state, action) => {
        state.isUpdatingStatus = false;
        const index = state.userTasks.findIndex(
          (task) => task._id === action.payload._id
        );
        state.currentTask = action.payload;
        state.userTasks.splice(index, 1, action.payload);
      })
      .addCase(changeTaskStatus.rejected, (state, action) => {
        state.isUpdatingStatus = false;
        state.error = action.payload;
      });
  },
});

export const { getCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
