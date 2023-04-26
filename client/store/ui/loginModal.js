import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
  closable: true,
};

const slice = createSlice({
  name: "loginModal",
  initialState,
  reducers: {
    setLoginModalVisibility: (state, action) => {
      state.visible = action.payload;
    },
    setLoginModalClosable: (state, action) => {
      state.closable = action.payload;
    },
  },
});

export const { setLoginModalVisibility, setLoginModalClosable } = slice.actions;
export default slice.reducer;
