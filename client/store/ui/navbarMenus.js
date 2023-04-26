import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "navbarmenus",
  initialState,
  reducers: {
    loadingNavbarMenus: (state, action) => {
      state.loading = action.payload;
    },
    setNavbarMenus: (state, action) => {
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingNavbarMenus, setNavbarMenus } = slice.actions;
