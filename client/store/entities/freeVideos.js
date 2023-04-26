import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "freeVideos",
  initialState,
  reducers: {
    loadingFreeVideos: (state, action) => {
      state.loading = action.payload;
    },

    setFreeVideos: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingFreeVideos, setFreeVideos } = slice.actions;
