import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const getUserProjects = createAsyncThunk(
  "project/getUserProjects",
  async (data, thunkApi) => {
    console.log(data);
    let query = "";
    if (data.query) {
      query = `page=${data.query.page}`;
    }
    try {
      const res = await api.get(`/projects?${query}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(
        error.message || "Failed fetching projects"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (projectData, thunkApi) => {
    try {
      const res = await api.post("/projects", projectData);
      return res.data.project;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data?.message);
    }
  }
);

export const getProjectById = createAsyncThunk(
  "project/getProjectById",
  async (projectId, thunkApi) => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      return res.data.project;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(
        error.response.data.message || "Failed fetching project"
      );
    }
  }
);

export const updateProjectDescription = createAsyncThunk(
  "project/updateDescription",
  async (data, thunkApi) => {
    const { projectId, description } = data;
    try {
      const res = await api.patch(`/projects/${projectId}/update-description`, {
        description,
      });
      return res.data.project;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(
        error.response.data.message || "Failed updating description"
      );
    }
  }
);

export const uploadFiles = createAsyncThunk(
  "project/uploadFiles",
  async (data, thunkApi) => {
    const { projectId, formData } = data;
    try {
      const res = await api.post(`/projects/${projectId}/uploads`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.project;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProjectName = createAsyncThunk(
  "project/updateProjectName",
  async (payload, thunkApi) => {
    const { name, projectId } = payload;
    try {
      const res = await api.patch(`/projects/${projectId}/update-name`, {
        name,
      });
      return res.data.project;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (payload, thunkApi) => {
    try {
      const { projectId } = payload;
      const res = await api.delete(`/projects/${projectId}`);
      return res.data.projectId;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(
        error.response.data.message || "something went while deleting project"
      );
    }
  }
);
