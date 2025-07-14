'use client';
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/notifications', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched notifications data:', data); // Debug log
        // Handle both direct array and wrapped response
        const notificationList = data.data || data || [];
        console.log('Notification list:', notificationList); // Debug log
        setNotifications(Array.isArray(notificationList) ? notificationList : []);
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
      } else {
        throw new Error('Failed to mark notification as read');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  }, []);

  const respondToFollowRequest = useCallback(async (notificationId: number, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/notifications/follow/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams({
          notification_id: notificationId.toString(),
          action: action,
        }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, action_taken: action, is_read: true }
              : notif
          )
        );
      } else {
        throw new Error(`Failed to ${action} follow request`);
      }
    } catch (err) {
      console.error(`Error responding to follow request:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${action} follow request`);
    }
  }, []);

  const respondToGroupInvitation = useCallback(async (notificationId: number, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/notifications/group/invitation/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams({
          notification_id: notificationId.toString(),
          action: action,
        }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, action_taken: action, is_read: true }
              : notif
          )
        );
      } else {
        throw new Error(`Failed to ${action} group invitation`);
      }
    } catch (err) {
      console.error(`Error responding to group invitation:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${action} group invitation`);
    }
  }, []);

  const respondToJoinRequest = useCallback(async (notificationId: number, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/notifications/group/join/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams({
          notification_id: notificationId.toString(),
          action: action,
        }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, action_taken: action, is_read: true }
              : notif
          )
        );
      } else {
        throw new Error(`Failed to ${action} join request`);
      }
    } catch (err) {
      console.error(`Error responding to join request:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${action} join request`);
    }
  }, []);

  const handleNotificationAction = useCallback(async (notificationId: number, action: 'accepted' | 'rejected') => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    const actionType = action === 'accepted' ? 'accept' : 'decline';

    switch (notification.type) {
      case 'follow_request':
        await respondToFollowRequest(notificationId, actionType);
        break;
      case 'group_invitation':
        await respondToGroupInvitation(notificationId, actionType);
        break;
      case 'group_join_request':
        await respondToJoinRequest(notificationId, actionType);
        break;
      default:
        console.warn('Unknown notification type:', notification.type);
    }
  }, [notifications, respondToFollowRequest, respondToGroupInvitation, respondToJoinRequest]);

  // Auto-fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 5 seconds for faster updates
    const interval = setInterval(fetchNotifications, 5000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    handleNotificationAction,
  };
};
