import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FaBell,
  FaCheckDouble,
  FaTrash,
  FaBriefcase,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";

import { useNotifications } from "../../Context/NotificationContext";

import "./index.scss";

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case "application":
        return <FaBriefcase />;

      case "status":
        return <FaCheckCircle />;

      default:
        return <FaInfoCircle />;
    }
  };

  const getLink = (notification) => {
    if (notification.link) return notification.link;
    if (notification.type === "application") return "/admin/applications";
    return "/my-applications";
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">

        {/* Header */}
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your latest activities.</p>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={markAllAsRead}
            >
              <FaCheckDouble />
              Mark all as read
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="notification-summary">
          <div className="summary-card">
            <FaBell />
            <div>
              <h3>{notifications.length}</h3>
              <p>Total notifications</p>
            </div>
          </div>

          <div className="summary-card unread-summary">
            <div className="unread-dot"></div>
            <div>
              <h3>{unreadCount}</h3>
              <p>Unread notifications</p>
            </div>
          </div>
        </div>

        {/* Notification list */}
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <FaBell />
              <h2>No notifications yet</h2>
              <p>You're all caught up! New updates will appear here.</p>
              <Link to="/" className="back-home">
                Explore Jobs
              </Link>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.read ? "unread" : ""
                }`}
              >
                <div className="notification-icon">
                  {getIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <h3>{notification.title}</h3>

                  <p>{notification.message}</p>

                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>

                  <div className="notification-actions">
                    <Link
                      to={getLink(notification)}
                      onClick={() => markAsRead(notification.id)}
                    >
                      View details
                    </Link>

                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>

                <button
                  className="delete-notification"
                  title="Delete notification"
                  onClick={() => removeNotification(notification.id)}
                >
                  <FaTrash />
                </button>

                {!notification.read && (
                  <span className="unread-indicator"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;