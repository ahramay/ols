import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedAt: null,
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "subscriptionPlans",
  initialState,
  reducers: {
    loadingSubscriptionPlans: (state, action) => {
      state.loading = action.payload;
    },
    setSubscriptionPlans: (state, action) => {
      state.cachedAt = Date.now();
      state.list = action.payload;
    },
  },
});

export default slice.reducer;
export const { loadingSubscriptionPlans, setSubscriptionPlans } = slice.actions;
