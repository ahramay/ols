import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "navbarMenus",
  initialState,
  reducers: {
    loadingNavbarMenus: (state, action) => {
      state.loading = action.payload;
    },
    deleteNavbarMenu: (state, action) => {
      const index = state.list.findIndex((item) => item._id === action.payload);
      if (index !== -1) state.list.splice(index, 1);
    },
    setNavbarMenus: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadingNavbarMenus,
  setNavbarMenus,
  deleteNavbarMenu,
} = slice.actions;
