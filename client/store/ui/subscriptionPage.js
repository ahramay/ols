import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    heading: "",
    text: "",
    text2: "",
    buttonText: "",
    buttonLink: "",

    metaTitle: "",
    metaDescription: "",
    metaKeyWords: "",

    //modal
    topHeading: "",
    coursesSelectedHeading: "",
    priceLabel: "",
    confirmation: "",
    subPer: "",
    bottomHeading: "",
  },
};

const slice = createSlice({
  name: "subscriptionPageData",
  initialState,
  reducers: {
    setSubscriptionLoader: (state, action) => {
      state.loading = action.payload;
    },
    setSubscriptionData: (state, action) => {
      for (let key in action.payload) {
        if (action.payload[key]) state.data[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setSubscriptionLoader, setSubscriptionData } = slice.actions;
