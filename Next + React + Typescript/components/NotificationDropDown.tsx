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

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(notification => (
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
