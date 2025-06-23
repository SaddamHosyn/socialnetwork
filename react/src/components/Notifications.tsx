import { useEffect, useState } from 'react';
import { fetchNotifications, markAsRead } from '../api/notifications';
import { Notification } from '../types';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications()
      .then(setNotifications)
      .catch(err => setError(err.message));
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notifications-container p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Notifications</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {notifications.map(n => (
          <li
            key={n.id}
            className={`p-2 border-b ${n.is_read ? 'text-gray-500' : 'text-black'}`}
          >
            <span>{n.content}</span>
            {!n.is_read && (
              <button
                className="ml-4 text-blue-500 underline"
                onClick={() => handleMarkRead(n.id)}
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
