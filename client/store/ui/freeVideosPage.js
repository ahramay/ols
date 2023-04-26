import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    heading1: "",
    heading2: "",
    heading3: "",
    heading4: "",
    heading5: "",
    text1: "",
    text2: "",
    text3: "",
    buttonText1: "",
    buttonLink1: "",
    buttonText2: "",
    buttonLink2: "",
    buttonText3: "",
    buttonLink3: "",
    metaTitle: "",
    metaDescription: "",
    metaKeyWords: "",
  },
};

const slice = createSlice({
  name: "freeVideosPage",
  initialState,
  reducers: {
    setFreeVideosPageLoader: (state, action) => {
      state.loading = action.payload;
    },
    setFreeVideosPageData: (state, action) => {
      for (let key in action.payload) {
        if (action.payload[key]) state.data[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setFreeVideosPageLoader, setFreeVideosPageData } = slice.actions;
