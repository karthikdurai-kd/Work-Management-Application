// Users Reducer

import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: null,
    allUsers: [],
    notifications: [], // For storing notification
  },
  reducers: {
    // setUser action - set the data of the single user
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // setUsers action - set the data of all the users
    setAllUsers: (state, action) => {
      state.users = action.payload;
    },

    // setNotification action - saving notification recieved for the logged in user
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const { setUser, setAllUsers, setNotifications } = usersSlice.actions;
const usersReducer = usersSlice.reducer;
export default usersReducer;
