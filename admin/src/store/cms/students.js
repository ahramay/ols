import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "students",
  initialState,
  reducers: {
    loadingStudents: (state, action) => {
      state.loading = action.payload;
    },
    deleteStudent: (state, action) => {
      const index = state.list.findIndex((item) => item._id === action.payload);
      if (index !== -1) state.list.splice(index, 1);
    },
    setStudents: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingStudents, setStudents, deleteStudent } = slice.actions;
