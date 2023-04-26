import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    heading1: "",
    heading2: "",
    teacherText: "",
    subscriptionText: "",
    subscriptionBtnText: "",
    subscriptionBtnLink: "",
    coursemenuText: "",
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
    img2: "",
    metaDescription: "",
    metaKeyWords: "",
    userCount: 0,
  },
};

const slice = createSlice({
  name: "homePageData",
  initialState,
  reducers: {
    setHomeLoader: (state, action) => {
      state.loading = action.payload;
    },
    setHomeData: (state, action) => {
      for (let key in action.payload) {
        if (action.payload[key]) state.data[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setHomeLoader, setHomeData } = slice.actions;
