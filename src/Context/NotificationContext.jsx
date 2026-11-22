import React, {
  createContext,
  useContext,
  useState,
  useCallback
} from "react";

import {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification
} from "../Services/jobApi"

import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);

  // Fetch notifications for the current user
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    try {
      const response = await getNotifications();

      const userNotifications = response.data.filter(
        (notification) =>
          String(notification.userId) === String(user.id)
      );

      // Latest notification first
      userNotifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(userNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [user?.id]);

  // Create notification
  const createNotification = async (data) => {
    try {
      const notificationData = {
        ...data,
        userId: data.userId ?? user?.id,
        read: false,
        createdAt: new Date().toISOString()
      };

      const response = await addNotification(notificationData);

      setNotifications((prev) => [
        response.data,
        ...prev
      ]);

      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  // Mark one notification as read
  const markAsRead = async (id) => {
    try {
      await updateNotification(id, { read: true });

      setNotifications((prev) =>
        prev.map((notification) =>
          String(notification.id) === String(id)
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.read
      );

      await Promise.all(
        unreadNotifications.map((notification) =>
          updateNotification(notification.id, { read: true })
        )
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true
        }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Delete notification
  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            String(notification.id) !== String(id)
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Unread count
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        createNotification,
        markAsRead,
        markAllAsRead,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);