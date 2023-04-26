import { createSlice } from "@reduxjs/toolkit";
import storage from "../../services/storage";

const user = storage.get("adminUser") || {
  username: "",
  _id: "",
  image: "",
  email: "",
};

const token = storage.get("adminAuthToken") || "";

const initialState = {
  token,
  user,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    resetAuth: (state) => {
      state = initialState;
    },
  },
});

export const { setUser, setToken, resetAuth } = slice.actions;
export default slice.reducer;
