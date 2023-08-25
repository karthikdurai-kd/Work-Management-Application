// This is Protected Page component to send the token and verify whether user has logged in or not

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Avatar, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import NotificationModel from "./NotificationModel";
import { userProfileAPI } from "../apiCalls/userApiCall";
import { setUser, setNotifications } from "../store/users/usersReducer";
import { setLoading } from "../store/loader/loaderReducer";
import { getNotificationAPICall } from "../apiCalls/notificationAPICall";

const ProtectedPage = ({ children }) => {
  // Navigation
  const navigate = useNavigate();

  // Notification model state
  const [showNotification, setShowNotification] = useState(false);

  // useDispatch hook for dispatching redux action
  const dispatch = useDispatch();

  // useSelector hook for getting redux "user" data
  const { user } = useSelector((state) => {
    return state.users;
  });

  // Logout event
  const handleLogout = () => {
    localStorage.removeItem("token"); // Removing token after clicking logout button
    dispatch(setUser(null)); // Clearing the user data from redux store after logout
    navigate("/login");
  };

  // Calling user profile view API - "/users/api/profile"
  const getUserProfile = async () => {
    try {
      dispatch(setLoading(true)); // Calling setLoading action and setting it to true
      const fetchUserProfileAPIResponse = await userProfileAPI();
      if (fetchUserProfileAPIResponse.status === "success") {
        // Calling "setUser" redux action through dispatch and passing the "user data" we got from backend
        dispatch(setUser(fetchUserProfileAPIResponse.data));
        dispatch(setLoading(false)); // Calling setLoading action and setting it to false
      } else {
        throw new Error(fetchUserProfileAPIResponse.message);
      }
    } catch (err) {
      dispatch(setLoading(false)); // Calling setLoading action and setting it to false
      localStorage.removeItem("token"); // Removing token if there is any error while fetching user profile data

      if (!localStorage.getItem("token") === null) {
        message.error(err.message);
      }
      // Redirecting to login page if there is any error in fetching user profile
      navigate("/login");
    }
  };

  // getNotification
  const getNotification = async () => {
    try {
      dispatch(setLoading(false));
      const getNotificationAPICallResponse = await getNotificationAPICall();
      if (getNotificationAPICallResponse.status === "success") {
        dispatch(setNotifications(getNotificationAPICallResponse.data)); // Calling "setNotiifications" redux action for sving the notification in redux store [userReducer]
        dispatch(setLoading(false));
      } else {
        throw new Error(getNotificationAPICallResponse.message);
      }
    } catch (err) {
      dispatch(setLoading(false));
    }
  };

  // useSelector hook for notification
  const { notifications } = useSelector((state) => {
    return state.users;
  });

  useEffect(() => {
    // calling "getUSerProfile()" method to get the user profile data
    getUserProfile();
  }, []);

  useEffect(() => {
    getNotification();
  }, [user]); // Whenever "user" state in redux store changes, then call getNotification function

  // UI
  return (
    user && ( // only after getting user only protected route must be rendered
      <div>
        <div className="flex justify-between items-center bg-primary text-white px-5 py-4">
          <h1
            className="text-2xl cursor-pointer"
            onClick={() => {
              navigate("/"); // When title is clicked it is naviagated to home page
            }}
          >
            Work Management Software
          </h1>
          <div className="flex items-center bg-white pt-2 pb-2 px-5 py-2 rounded">
            <span
              className="text-primary cursor-pointer mr-2"
              onClick={() => navigate("/profile")}
            >
              {user?.firstName}
            </span>
            <Badge
              count={
                notifications.filter((notification) => {
                  return !notification.read;
                }).length
              }
              onClick={() => {
                setShowNotification(true);
              }}
              className="cursor-pointer"
            >
              <Avatar
                shape="square"
                size="large"
                icon={
                  <i className="ri-notification-4-line text-white rounded-full"></i>
                }
              />
            </Badge>

            <i
              className="text-xl ri-logout-box-line ml-10 text-primary"
              onClick={handleLogout}
            ></i>
          </div>
        </div>
        <div className="px-5 px-3">{children}</div>
        {showNotification && (
          <NotificationModel
            showNotification={showNotification}
            setShowNotification={setShowNotification}
            getNotification={getNotification}
          />
        )}
      </div>
    )
  );
};

export default ProtectedPage;
