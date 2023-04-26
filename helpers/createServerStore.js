import { configureStore } from "@reduxjs/toolkit";

import reducers from "../client/store/reducers";
export default () =>
  configureStore({
    reducer: reducers,
  });
