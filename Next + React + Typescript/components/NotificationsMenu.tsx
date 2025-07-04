import React, { useEffect, useState } from "react";
import { fetchNotifications, markAsRead } from "../api/notifications";
import type { Notification } from "../types/types";
import "./notification.css";

const notificationIcon = (
  <svg width="24" height="24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="none" />
    <path d="M12 17c1.7 0 3-1.3 3-3H9c0 1.7 1.3 3 3 3zm5-3V9c0-2.8-2.2-5-5-5S7 6.2 7 9v5l-1.3 1.3c-.2.2-.3.5-.3.7v.5h14v-.5c0-.2-.1-.5-.3-.7L17 14z" />
  </svg>
);

function getNotificationStyle(type: string) {
  switch (type) {
    case "FOLLOW_REQUEST":
      return { background: "#e3f2fd", color: "#1976d2" };
    case "GROUP_INVITE":
      return { background: "#fff3e0", color: "#f57c00" };
    case "GROUP_JOIN_REQUEST":
      return { background: "#fce4ec", color: "#c2185b" };
    case "GROUP_EVENT":
      return { background: "#e8f5e9", color: "#388e3c" };
    default:
      return {};
  }
}

const NotificationsMenu: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications()
      .then(setNotifications)
      .catch((err) => {
        if (err.message.includes("401")) {
          setError("You must be logged in to see notifications.");
        } else {
          setError(err.message);
        }
      });
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-menu">
      <button
        className="notification-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Show notifications"
      >
        {notificationIcon}
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="notification-dropdown">
          {error && <div className="notification-empty">{error}</div>}
          {notifications.length === 0 ? (
            <div className="notification-empty">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-item${n.is_read ? " read" : ""}`}
                style={getNotificationStyle(n.type)}
                onClick={() => handleMarkRead(n.id)}
              >
                <div className="notification-message">{n.content}</div>
                <div className="notification-time">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
