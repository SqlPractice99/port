import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: 'en',
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    clearLanguage: (state) => {
      state.language = false;
    },
  },
});

export const { setLanguage, clearLanguage } = languageSlice.actions;

export default languageSlice.reducer;