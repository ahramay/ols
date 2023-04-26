import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    mainHeading: "",
    heading2: "",
    heading3: "",
    image1: "",
    metaTitle: "",
    metaDescription: "",
    metaKeyWords: "",
  },
};

const slice = createSlice({
  name: "aboutPageData",
  initialState,
  reducers: {
    setAboutLoader: (state, action) => {
      state.loading = action.payload;
    },
    setAboutData: (state, action) => {
      for (let key in action.payload) {
        if (action.payload[key]) state.data[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setAboutLoader, setAboutData } = slice.actions;
