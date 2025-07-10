import React, { useState, useEffect } from 'react';
import { FollowButton } from './FollowButton';
import type { PublicUser } from '../types/types';

interface UserListProps {
  users?: PublicUser[];
  currentUserId?: number;
  onUserClick?: (user: PublicUser) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users = [],
  currentUserId,
  onUserClick,
}) => {
  const [userList, setUserList] = useState<PublicUser[]>([]);

  useEffect(() => {
    // Filter out current user from the list
    const filteredUsers = users.filter((user) => user.id !== currentUserId);
    setUserList(filteredUsers);
  }, [users, currentUserId]);

  const handleUserClick = (user: PublicUser) => {
    onUserClick?.(user);
  };

  if (userList.length === 0) {
    return (
      <div id="user-list">
        <p className="no-users">No users found</p>
      </div>
    );
  }

  return (
    <div id="user-list">
      {userList.map((user) => (
        <div key={user.id} className="user-item" data-user-id={user.id}>
          <div className="user-info">
            <h4
              className="user-nickname"
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer" }}
            >
              {user.nickname || `${user.first_name} ${user.last_name}` || user.email}
            </h4>
            <p className="user-email">{user.email}</p>
            {user.is_private && <span className="private-badge">Private</span>}
            <small className="user-date">
              Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
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
