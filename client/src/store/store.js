import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users/usersReducer";
import loaderReducer from "./loader/loaderReducer";

const store = configureStore({
  reducer: {
    users: usersReducer, // setting up the user reducer
    loader: loaderReducer,
  },
});

export default store;
