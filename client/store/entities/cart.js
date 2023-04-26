import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem: (state, action) => {
      const prevIndex = state.items.findIndex(
        (i) => i._id === action.payload._id
      );

      if (prevIndex !== -1) {
        state.items[prevIndex] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },

    removeCartItem: (state, action) => {
      const prevIndex = state.items.findIndex(
        (i) => i._id === action.payload._id
      );

      if (prevIndex !== -1) {
        state.items.splice(prevIndex, 1);
      }
    },
    setCart: (state, action) => {
      for (let key in action.payload) state[key] = action.payload[key];
    },
    resetCart: (state, action) => {
      for (let key in initialState) state[key] = initialState[key];
    },
  },
});

export default slice.reducer;
export const {
  setCart,
  addCartItem,
  removeCartItem,
  resetCart,
} = slice.actions;
