import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: {
    mainHeading: "",
    text1: "",
    heading1: "",

    metaTitle: "",
    metaDescription: "",
    metaKeyWords: "",
  },
};

const slice = createSlice({
  name: "ourTeachers",
  initialState,
  reducers: {
    setOurTeachersLoader: (state, action) => {
      state.loading = action.payload;
    },
    setOurTeachersData: (state, action) => {
      for (let key in action.payload) {
        if (action.payload[key]) state.data[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setOurTeachersLoader, setOurTeachersData } = slice.actions;
