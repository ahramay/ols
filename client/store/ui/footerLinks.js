import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "footerLinks",
  initialState,
  reducers: {
    loadingFooterLinks: (state, action) => {
      state.loading = action.payload;
    },
    setFooterLinks: (state, action) => {
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingFooterLinks, setFooterLinks } = slice.actions;
