import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    mainHeading: "",
    text1: "",
    metaTitle: "",
    metaDescription: "",
    metaKeyWords: "",
  },
};

const slice = createSlice({
  name: "aboutWhyData",
  initialState,
  reducers: {
    setWhyLoader: (state, action) => {
      state.loading = action.payload;
    },
    setWhyData: (state, action) => {
      for (let key in action.payload) {
        if (action.payload[key]) state.data[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setWhyLoader, setWhyData } = slice.actions;
