'use client';
import React from 'react';
import { Notification } from '../types/types';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  // Add safety check for notifications array to prevent filter errors
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.is_read).length;
  
  return (
    <div className="notification-bell">
      <button className="bell-icon">
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;
