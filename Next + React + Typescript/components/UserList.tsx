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
    <div id="user-list" style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      maxHeight: "400px",
      overflowY: "auto",
      padding: "0.5rem"
    }}>
      {userList.map((user) => (
        <div 
          key={user.id} 
          className="user-item" 
          data-user-id={user.id}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease"
          }}
        >
          {/* User Info Section */}
          <div className="user-info" style={{
            marginBottom: "0.5rem"
          }}>
            <h4
              className="user-nickname"
              onClick={() => handleUserClick(user)}
              style={{ 
                cursor: "pointer",
                margin: "0 0 0.25rem 0",
                fontSize: "0.95rem",
                fontWeight: "600",
                color: "#333",
                wordBreak: "break-word",
                lineHeight: "1.3"
              }}
            >
              {user.nickname || `${user.first_name} ${user.last_name}` || user.email}
            </h4>
            
            <p 
              className="user-email" 
              style={{
                margin: "0 0 0.25rem 0",
                fontSize: "0.8rem",
                color: "#666",
                wordBreak: "break-all",
                lineHeight: "1.2"
              }}
            >
              {user.email}
            </p>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap"
            }}>
              {user.is_private && (
                <span 
                  className="private-badge"
                  style={{
                    fontSize: "0.7rem",
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "0.15rem 0.4rem",
                    borderRadius: "12px",
                    fontWeight: "500"
                  }}
                >
                  🔒 Private
                </span>
              )}
              
              <small 
                className="user-date"
                style={{
                  fontSize: "0.7rem",
                  color: "#888",
                  lineHeight: "1.2"
                }}
              >
                Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </small>
            </div>
          </div>
          
          {/* Follow Button Section */}
          <div className="user-actions" style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
          }}>
            <FollowButton userId={user.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
