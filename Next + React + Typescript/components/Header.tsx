'use client';
import React, { useState, useEffect, useCallback } from 'react';
import NotificationBell from './Notificationbell';
import { Notification } from '../types/types';

type PageType = "home" | "posts" | "profile" | "login" | "register" | "groups";

type Props = {
  onLogout: () => void;
  isLoggedIn: boolean;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
};

const Header: React.FC<Props> = ({
  onLogout,
  isLoggedIn,
  currentPage,
  onNavigate,
}: Props) => {
  // Notification state management
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    
    try {
      const response = await fetch('/api/notifications', {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        console.log('User not authenticated - clearing notifications');
        setNotifications([]);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array to prevent filter errors
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]); // Set to empty array on error
    }
  }, [isLoggedIn]);

  // Fetch notifications on component mount and periodically
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    } else {
      // Clear notifications when not logged in
      setNotifications([]);
    }
  }, [isLoggedIn, fetchNotifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include'
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
        credentials: 'include',
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

  const handleNotificationBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 onClick={() => onNavigate("home")} className="logo">
          Gritlab Gossiper
        </h1>
      </div>
      
      <nav className="header-nav">
        {isLoggedIn ? (
          <>
            <button
              className={`nav-button ${currentPage === "posts" ? "active" : ""}`}
              onClick={() => onNavigate("posts")}
            >
              Posts
            </button>
            <button
              className={`nav-button ${currentPage === "groups" ? "active" : ""}`}
              onClick={() => onNavigate("groups")}
            >
              Groups
            </button>
            <button
              className={`nav-button ${
                currentPage === "profile" ? "active" : ""
              }`}
              onClick={() => onNavigate("profile")}
            >
              Profile
            </button>
            
            {/* Notification Bell integrated into navigation */}
            <NotificationBell
              notifications={notifications}
              onClick={handleNotificationBellClick}
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={handleMarkAsRead}
              onActionTaken={handleActionTaken}
            />
            
            <button className="nav-button logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-button ${currentPage === "login" ? "active" : ""}`}
              onClick={() => onNavigate("login")}
            >
              Login
            </button>
            <button
              className={`nav-button ${
                currentPage === "register" ? "active" : ""
              }`}
              onClick={() => onNavigate("register")}
            >
              Register
            </button>
          </>
        )}
      </nav>

      <div className="header-right">
        {/* Dropdown is now rendered inside NotificationBell component */}
      </div>
    </header>
  );
};

export default Header;
