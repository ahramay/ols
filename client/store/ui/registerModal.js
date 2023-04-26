import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
  closable: true,
};

const slice = createSlice({
  name: "registerModal",
  initialState,
  reducers: {
    setRegisterModalVisibility: (state, action) => {
      state.visible = action.payload;
    },
    setRegisterModalClosable: (state, action) => {
      state.closable = action.payload;
    },
  },
});

export const { setRegisterModalVisibility, setRegisterModalClosable } =
  slice.actions;
export default slice.reducer;
