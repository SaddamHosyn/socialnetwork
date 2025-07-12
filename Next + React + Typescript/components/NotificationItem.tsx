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

  const handleAction = async (action: 'accepted' | 'rejected') => {
    try {
      let endpoint = '';
      let body = {};

      switch (notification.type) {
        case 'follow_request':
          endpoint = '/api/notifications/follow/respond';
          body = {
            notification_id: notification.id,
            action: action
          };
          break;
        case 'group_invitation':
          endpoint = '/api/notifications/group/invitation/respond';
          body = {
            notification_id: notification.id,
            action: action
          };
          break;
        case 'group_join_request':
          endpoint = '/api/notifications/group/join/respond';
          body = {
            notification_id: notification.id,
            action: action
          };
          break;
        default:
          console.error('Unknown notification type:', notification.type);
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (response.ok) {
        onActionTaken(notification.id, action);
      } else {
        console.error('Failed to respond to notification');
      }
    } catch (error) {
      console.error('Error responding to notification:', error);
    }
  };

  const renderActionButtons = () => {
    if (!notification.requires_action || notification.action_taken !== '' && notification.action_taken !== 'pending') {
      return null;
    }

    return (
      <div className="notification-actions">
        <button 
          onClick={() => handleAction('accepted')}
          className="accept-btn"
        >
          Accept
        </button>
        <button 
          onClick={() => handleAction('rejected')}
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
        {notification.action_taken && notification.action_taken !== 'pending' && (
          <span className={`action-status ${notification.action_taken}`}>
            {notification.action_taken}
          </span>
        )}
      </div>
      {renderActionButtons()}
    </div>
  );
};

export default NotificationItem; 
