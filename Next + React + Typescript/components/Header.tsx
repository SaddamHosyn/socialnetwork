import React, { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';
import NotificationDropdown from './NotificationDropdown';
import { Notification } from '../types/types';
import { useNotificationWebSocket } from '../hooks/useNotificationWebSocket';

type Props = {
  onLogout: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onProfile: () => void;
};

const Header = ({
  onLogout,
  isLoggedIn,
  onLogin,
  onRegister,
  onProfile,
}: Props) => {
  // Notification state management
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications on component mount and periodically
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleActionTaken = async (id: number, action: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(`/api/notifications/${id}/action`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, action_taken: action } : n))
        );
      }
    } catch (error) {
      console.error('Error updating notification action:', error);
    }
  };

  return (
    <header>
      <div className="header-left">
        <h1>Gritlab Gossiper</h1>
      </div>
      <div className="header-right">
        {isLoggedIn && (
          <>
            <NotificationBell
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={() => {}}
            />
            <NotificationDropdown
              notifications={notifications}
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={handleMarkAsRead}
              onActionTaken={handleActionTaken}
            />
          </>
        )}
        
        {!isLoggedIn ? (
          <>
            <button onClick={onLogin}>Login</button>
            <button onClick={onRegister}>Register</button>
          </>
        ) : (
          <>
            <button onClick={onProfile}>Profile</button>
            <button onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
