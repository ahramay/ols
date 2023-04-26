import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
};

const slice = createSlice({
  name: "trialModal",
  initialState,
  reducers: {
    setTrialModalVisibility: (state, action) => {
      state.visible = action.payload;
    },
  },
});

export const { setTrialModalVisibility } = slice.actions;
export default slice.reducer;
