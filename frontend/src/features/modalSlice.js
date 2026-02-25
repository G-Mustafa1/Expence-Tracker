// store/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
    type: null, // "income" or "expense"
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.type = action.payload; // "income" or "expense"
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;