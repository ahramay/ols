import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    loadingActivities: (state, action) => {
      state.loading = action.payload;
    },
    updateActivity: (state, action) => {
      const { payload } = action;
      const ind = state.list.findIndex((ac) => {
        return ac._id === payload._id;
      });
      if (ind === -1) {
        state.list.push(payload);
      } else {
        state.list[ind] = payload;
      }
    },
    setActivities: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const {
  loadingActivities,
  setActivities,
  updateActivity,
} = slice.actions;
