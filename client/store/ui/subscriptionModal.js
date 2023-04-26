import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
  category: "",
  plan: {},
};

const slice = createSlice({
  name: "subscriptionModal",
  initialState,
  reducers: {
    setSubscriptionModal: (state, action) => {
      for (let key in action.payload) {
        state[key] = action.payload[key];
        console.log(`${key} => ${action.payload[key]}`);
      }
    },
  },
});

export const { setSubscriptionModal } = slice.actions;
export default slice.reducer;
