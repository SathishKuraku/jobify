import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

import { useNotifications } from "../../Context/NotificationContext";

import "./index.scss";

const NotificationBell = () => {
  const { unreadCount, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <Link to="/notifications" className="notification-bell">
      <FaBell />

      {unreadCount > 0 && (
        <span className="notification-count">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;