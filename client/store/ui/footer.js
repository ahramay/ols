import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paragraph: "",
  copyrightText: "",
  loading: false,
};

const slice = createSlice({
  name: "footerLinks",
  initialState,
  reducers: {
    loadingFooter: (state, action) => {
      state.loading = action.payload;
    },
    setFooter: (state, action) => {
      const { paragraph, copyrightText } = action.payload;
      state.paragraph = paragraph;
      state.copyrightText = copyrightText;
    },
  },
});

export default slice.reducer;
export const { loadingFooter, setFooter } = slice.actions;
