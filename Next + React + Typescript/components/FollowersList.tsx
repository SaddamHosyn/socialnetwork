import React, { useState, useEffect } from 'react';
import { useFollower } from '../hooks/useFollower';
import type { Follower } from '../types/types';

interface FollowersListProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'followers' | 'following';
}

export const FollowersList: React.FC<FollowersListProps> = ({
  userId,
  isOpen,
  onClose,
  title,
  type
}) => {
  const [users, setUsers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(false);
  const { getFollowers, getFollowing } = useFollower();

  useEffect(() => {
    if (isOpen && userId) {
      loadUsers();
    }
  }, [isOpen, userId, type]);

  const loadUsers = async () => {
    setLoading(true);
    let fetchedUsers: Follower[] = [];
    
    if (type === 'followers') {
      fetchedUsers = await getFollowers(userId);
    } else {
      fetchedUsers = await getFollowing(userId);
    }
    
    setUsers(fetchedUsers);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="followers-list-container">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          
          <div className="modal-body">
            {loading ? (
              <div className="loading">Loading {type}...</div>
            ) : users.length === 0 ? (
              <div className="no-users">No {type} found</div>
            ) : (
              <div className="users-list">
                {users.map(user => (
                  <div key={user.id} className="user-item">
                    <div className="user-info">
                      <div className="user-nickname">{user.nickname}</div>
                      <div className="user-date">
                        {type === 'followers' ? 'Followed' : 'Following'} since{' '}
                        {new Date(user.followed_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
