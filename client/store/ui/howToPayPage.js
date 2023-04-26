import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    buttonText: "",
    heading: "",
    text: "",
    image: "",
    metaTitle: "",
    metaDescription: "",
    metaKeyWords: "",
  },
};

const slice = createSlice({
  name: "howToPayPageData",
  initialState,
  reducers: {
    setHowToPayLoader: (state, action) => {
      state.loading = action.payload;
    },
    setHowToPayData: (state, action) => {
      for (let key in action.payload) {
        if (action.payload[key]) state.data[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setHowToPayLoader, setHowToPayData } = slice.actions;
