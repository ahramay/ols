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
    deleteFreeVideo: (state, action) => {
      const index = state.list.findIndex((item) => item._id === action.payload);
      if (index !== -1) state.list.splice(index, 1);
    },
    setFreeVideos: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadingFreeVideos,
  setFreeVideos,
  deleteFreeVideo,
} = slice.actions;
