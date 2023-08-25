// This is loader reducer for implementing loading screen while making API Calls

import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload; // Setting loading "true or false" from payload data
    },
  },
});

export const { setLoading } = loaderSlice.actions;
const loaderReducer = loaderSlice.reducer;
export default loaderReducer;
