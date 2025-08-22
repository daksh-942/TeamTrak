import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: false,
  activeComponent: "",
};

export const modalSlice = createSlice({
  initialState,
  name: "modal",
  reducers: {
    open: (state) => {
      state.state = true;
    },
    close: (state) => {
      state.state = false;
    },
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    },
  },
});

export const { open, close, setActiveComponent } = modalSlice.actions;
export default modalSlice.reducer;
