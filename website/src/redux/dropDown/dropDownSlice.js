import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dropDown: false,
};

const dropDownSlice = createSlice({
  name: "dropDown",
  initialState,
  reducers: {
    setDropDown: (state, action) => {
      state.dropDown = action.payload;
    },
    clearDropDown: (state) => {
      state.dropDown = false;
    },
  },
});

export const { setDropDown, clearDropDown } = dropDownSlice.actions;

export default dropDownSlice.reducer;