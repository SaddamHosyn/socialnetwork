import React, { useState, useEffect } from 'react';
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
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
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

