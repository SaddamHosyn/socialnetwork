'use client';
import React from 'react';
import { Notification } from '../types/types';
import NotificationDropdown from './NotificationDropDown';

interface NotificationBellProps {
  notifications: Notification[];
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
  onActionTaken: (id: number, action: 'accepted' | 'rejected') => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onClick,
  isOpen,
  onClose,
  onMarkAsRead,
  onActionTaken
}) => {
  // Add safety check for notifications array to prevent filter errors
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.is_read).length;
  
  return (
    <div className="notification-bell" onClick={onClick}>
      <button className="bell-icon">
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      
      {/* Render dropdown directly inside notification bell for proper positioning */}
      <NotificationDropdown
        notifications={notifications}
        isOpen={isOpen}
        onClose={onClose}
        onMarkAsRead={onMarkAsRead}
        onActionTaken={onActionTaken}
      />
    </div>
  );
};

export default NotificationBell;
