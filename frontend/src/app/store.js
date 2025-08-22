import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modal";
import authReducer from "./slices/auth/authSlice";
import projectReducer from "./slices/project/projectSlice";
import taskReducer from "./slices/task/taskSlice";
import teamReducer from "./slices/team/teamSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    project: projectReducer,
    task: taskReducer,
    team: teamReducer,
  },
});
