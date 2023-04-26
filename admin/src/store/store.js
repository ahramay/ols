import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import auth from "./auth/authReducer";
import cms from "./cms/cmsReducer";

const combinedReducers = combineReducers({
  auth,
  cms,
});

const store = configureStore({
  reducer: combinedReducers,
});
export default store;
