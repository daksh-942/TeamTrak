import { createSlice } from "@reduxjs/toolkit";
import {
  createProject,
  deleteProject,
  getProjectById,
  getUserProjects,
  updateProjectDescription,
  updateProjectName,
  uploadFiles,
} from "./projectThunk";

const initialState = {
  projects: [],
  currentProject: null,
  error: null,
  tasks: [],
  isUploadingFiles: false,
  isUpdatingName: false,
  isFetchingProjects: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    getCurrentProject: (state, action) => {
      const project = state.projects.find(
        (project) => project._id === action.payload
      );
      state.currentProject = project;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET_USER_PROJECTS
      .addCase(getUserProjects.pending, (state) => {
        state.isFetchingProjects = true;
      })
      .addCase(getUserProjects.fulfilled, (state, action) => {
        state.isFetchingProjects = false;
        state.projects = action.payload.projects;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(getUserProjects.rejected, (state, action) => {
        state.isFetchingProjects = false;
        state.error = action.payload;
      })

      // CREATE_PROJECT
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET_PROJECT_BY_ID
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentProject = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE_PROJECT_DESCRIPTION
      .addCase(updateProjectDescription.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        state.projects[index] = action.payload;
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(updateProjectDescription.rejected, (state, action) => {
        state.error = action.payload;
      })
      // UPLOAD FILES
      .addCase(uploadFiles.pending, (state) => {
        state.isUploadingFiles = true;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        const newProject = action.payload;
        const projectIndex = state.projects.findIndex(
          (project) => project._id === newProject._id
        );
        state.projects.splice(projectIndex, 1, newProject);
        state.currentProject = newProject;
        state.isUploadingFiles = false;
        state.error = null;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.isUploadingFiles = false;
      })
      .addCase(updateProjectName.pending, (state) => {
        state.isUpdatingName = true;
      })
      .addCase(updateProjectName.fulfilled, (state, action) => {
        state.isUpdatingName = false;
        const newProject = action.payload;
        const index = state.projects.findIndex(
          (project) => project._id === newProject._id
        );
        state.projects.splice(index, 1, newProject);
        state.currentProject = newProject;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
        state.currentProject = null;
      });
  },
});

export const { getCurrentProject, setCurrentPage } = projectSlice.actions;
export default projectSlice.reducer;
