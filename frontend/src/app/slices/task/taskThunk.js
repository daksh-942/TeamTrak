import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const getProjectTasks = createAsyncThunk(
  "task/getProjectTask",
  async (data, thunkApi) => {
    const { projectId } = data;
    try {
      const res = await api.get(`/tasks?project=${projectId}`);
      return res.data.tasks;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data.message || "failed");
    }
  }
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (task, thunkApi) => {
    try {
      console.log(task);
      const res = await api.post("/tasks", task);
      return res.data.task;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data.message || "failed");
    }
  }
);

export const getUserTasks = createAsyncThunk(
  "task/userTasks",
  async (data, thunkApi) => {
    const { userId } = data;
    try {
      const res = await api.get(`/tasks?assignee=${userId}`);
      return res.data.tasks;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const changeTaskStatus = createAsyncThunk(
  "task/changeTaskStatus",
  async (taskData, thunkApi) => {
    const { taskId, status } = taskData;
    try {
      const res = await api.patch(`tasks/${taskId}/status`, { status });
      return res.data.task;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);
