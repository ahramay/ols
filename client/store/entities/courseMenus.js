import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promoImage: "",
  topHeading: "",
  oLevelLinks: "",
  oLevelImage: "",
  //plus
  satPrepLinks: "",
  satPrepImage: "",
  //premium
  aLevelLinks: "",
  aLevelImage: "",
};

const slice = createSlice({
  name: "setCourseMenus",
  initialState,
  reducers: {
    setCourseMenus: (state, action) => {
      for (let key in action.payload) {
        state[key] = action.payload[key];
      }
    },
  },
});

export default slice.reducer;
export const { setCourseMenus } = slice.actions;
