import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "blogcategories",
  initialState,
  reducers: {
    loadingBlogCategories: (state, action) => {
      state.loading = action.payload;
    },
    setBlogCategories: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingBlogCategories, setBlogCategories } = slice.actions;
