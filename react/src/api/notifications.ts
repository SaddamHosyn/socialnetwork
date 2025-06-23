import { Notification } from '../types';

export async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch('/api/notifications', {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
}

export async function markAsRead(id: number): Promise<void> {
  const response = await fetch(`/api/notifications/mark?id=${id}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to mark as read');
}
