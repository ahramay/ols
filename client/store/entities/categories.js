import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    loadingCategories: (state, action) => {
      state.loading = action.payload;
    },
    setCategories: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingCategories, setCategories } = slice.actions;
