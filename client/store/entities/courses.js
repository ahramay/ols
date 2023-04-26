import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    loadingCourses: (state, action) => {
      state.loading = action.payload;
    },
    setCourses: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingCourses, setCourses } = slice.actions;
