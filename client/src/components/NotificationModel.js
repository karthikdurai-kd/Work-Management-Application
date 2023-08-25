// Notification Model
import momemt from "moment";
import { Modal, message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  markNotificationReadAPICall,
  deleteAllNotificationAPICall,
} from "../apiCalls/notificationAPICall";
import { setNotifications } from "../store/users/usersReducer";
import { setLoading } from "../store/loader/loaderReducer";

const NotificationModel = ({ showNotification, setShowNotification }) => {
  // Getting notification state data from redux store
  const { notifications } = useSelector((state) => {
    return state.users;
  });

  // useDispatch hook
  const dispatch = useDispatch();

  // Mark Notifications as "read"
  const markNotificationsRead = async () => {
    try {
      const markNotificationReadAPICallResponse =
        await markNotificationReadAPICall();
      if (markNotificationReadAPICallResponse.status === "success") {
        dispatch(setNotifications(markNotificationReadAPICallResponse.data)); // Calling "setNotification" action to update the notification in redux store
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // Delete All Notification event
  const deleteAllNotification = async () => {
    try {
      dispatch(setLoading(true));
      const deleteAllNotificationAPICallResponse =
        await deleteAllNotificationAPICall();
      if (deleteAllNotificationAPICallResponse.status === "success") {
        dispatch(setNotifications([])); // After deleting the notification in the backend, clearing the redux store notification state
        dispatch(setLoading(false));
        setShowNotification(false); // Closing the model
      } else {
        throw new Error(deleteAllNotificationAPICallResponse.message);
      }
    } catch (err) {
      dispatch(setLoading(true));
      message.error(err.message);
    }
  };

  useEffect(() => {
    // Calling markNotificationsRead() method only if there is any "unread" notification
    if (
      notifications.filter((notification) => {
        return !notification.read;
      }).length > 0
    ) {
      markNotificationsRead();
    }
  }, [markNotificationsRead]);

  // useNavigate Hook
  const navigate = useNavigate();

  // UI
  return (
    <Modal
      title="Notifications"
      open={showNotification}
      onCancel={() => {
        setShowNotification(false);
      }}
      footer={null}
      centered
      width={800}
    >
      {notifications && (
        <div className="flex flex-col gap-5 mt-5">
          {notifications.length == 0 ? (
            <div className="flex justify-center">
              <span className="text-md" onClick={deleteAllNotification}>
                No Notifications
              </span>
            </div>
          ) : (
            <div className="flex justify-end">
              <span
                className="text-md underline cursor-pointer"
                onClick={deleteAllNotification}
              >
                Clear All
              </span>
            </div>
          )}
          {notifications.map((notification) => {
            return (
              <div
                className="flex justify-between items-end border border-solid p-2 rounded"
                onClick={() => {
                  setShowNotification(false); // Closing Notification model
                  navigate(notification.onClick); // This will redirect to the page where notification was generated
                }}
              >
                <div className="flex flex-col">
                  <span className="text-md font-semibold text-gray-700">
                    {notification.title}
                  </span>
                  <span className="text-sm">{notification.description}</span>
                </div>
                <div>
                  <span className="text-sm">
                    {momemt(notification.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
};

export default NotificationModel;
