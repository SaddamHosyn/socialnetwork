import React from 'react';
import { Notification } from '../types/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onActionTaken: (id: number, action: 'accepted' | 'rejected') => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onActionTaken
}) => {
  const handleMarkAsRead = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const renderActionButtons = () => {
    if (!notification.requires_action || notification.action_taken !== 'pending') {
      return null;
    }

    return (
      <div className="notification-actions">
        <button 
          onClick={() => onActionTaken(notification.id, 'accepted')}
          className="accept-btn"
        >
          Accept
        </button>
        <button 
          onClick={() => onActionTaken(notification.id, 'rejected')}
          className="reject-btn"
        >
          Reject
        </button>
      </div>
    );
  };

  return (
    <div 
      className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
      onClick={handleMarkAsRead}
    >
      <div className="notification-content">
        <p>{notification.content}</p>
        <span className="notification-time">
          {new Date(notification.created_at).toLocaleString()}
        </span>
      </div>
      {renderActionButtons()}
    </div>
  );
};


export default NotificationItem; 
