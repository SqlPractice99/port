import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: 'Home',
};

const selectedTabSlice = createSlice({
  name: "selectedTab",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    clearSelectedTab: (state) => {
      state.selectedTab = 'Home';
    },
  },
});

export const { setSelectedTab, clearSelectedTab } = selectedTabSlice.actions;

export default selectedTabSlice.reducer;