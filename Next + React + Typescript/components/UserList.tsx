import React, { useState, useEffect } from 'react';
import { FollowButton } from './FollowButton';
import type { User } from '../types';

interface UserListProps {
  users?: User[];
  currentUserId?: number;
  onUserClick?: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users = [],
  currentUserId,
  onUserClick
}) => {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    // Filter out current user from the list
    const filteredUsers = users.filter(user => user.id !== currentUserId);
    setUserList(filteredUsers);
  }, [users, currentUserId]);

  const handleUserClick = (user: User) => {
    onUserClick?.(user);
  };

  if (userList.length === 0) {
    return (
      <div className="user-list">
        <p className="no-users">No users found</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      {userList.map((user) => (
        <div key={user.id} className="user-item" data-user-id={user.id}>
          <div className="user-info">
            <h4 
              className="user-nickname" 
              onClick={() => handleUserClick(user)}
              style={{ cursor: 'pointer' }}
            >
              {user.nickname}
            </h4>
            <p className="user-email">{user.email}</p>
            {user.is_private && <span className="private-badge">Private</span>}
            <small className="user-date">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </small>
          </div>
          <div className="user-actions">
            <FollowButton userId={user.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
