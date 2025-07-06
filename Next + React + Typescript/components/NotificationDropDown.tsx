'use client';
import React from 'react';
import { Notification } from '../types/types';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
  onActionTaken: (id: number, action: 'accepted' | 'rejected') => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onActionTaken
}) => {
  if (!isOpen) return null;

  // Add safety check for notifications array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="notification-list">
        {safeNotifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          safeNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onActionTaken={onActionTaken}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
