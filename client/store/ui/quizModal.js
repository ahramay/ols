import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
};

const slice = createSlice({
  name: "quizModal",
  initialState,
  reducers: {
    setQuizModalVisibility: (state, action) => {
      state.visible = action.payload;
    },
  },
});

export const { setQuizModalVisibility } = slice.actions;
export default slice.reducer;
