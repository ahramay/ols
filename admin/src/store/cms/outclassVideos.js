import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "OCVideos",
  initialState,
  reducers: {
    loadingOCVideos: (state, action) => {
      state.loading = action.payload;
    },
    deleteOCVideo: (state, action) => {
      const index = state.list.findIndex((item) => item._id === action.payload);
      if (index !== -1) state.list.splice(index, 1);
    },
    setOCVideo: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingOCVideos, setOCVideo, deleteOCVideo } = slice.actions;
