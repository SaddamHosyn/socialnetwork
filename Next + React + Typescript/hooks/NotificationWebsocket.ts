import { useEffect, useRef } from 'react';
import { Notification } from '../types/types';

interface UseNotificationWebSocketProps {
  onNewNotification: (notification: Notification) => void;
  isLoggedIn: boolean;
}

export const NotificationWebSocket = ({
  onNewNotification,
  isLoggedIn
}: UseNotificationWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Connect to WebSocket
    wsRef.current = new WebSocket('ws://localhost:8080/ws/notifications');

    wsRef.current.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        onNewNotification(notification);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isLoggedIn, onNewNotification]);

  return wsRef.current;
};
