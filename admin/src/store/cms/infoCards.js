import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "infoCards",
  initialState,
  reducers: {
    loadingInfoCards: (state, action) => {
      state.loading = action.payload;
    },
    deleteInfoCards: (state, action) => {
      const index = state.list.findIndex((item) => item._id === action.payload);
      if (index !== -1) state.list.splice(index, 1);
    },
    setInfoCards: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadingInfoCards,
  setInfoCards,
  deleteInfoCards,
} = slice.actions;
