'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';

interface Follower {
  id: number;
  nickname: string;
  email: string;
  created_at: string;
}

interface FollowersListProps {
  userId: number;
  type: 'followers' | 'following';
}

const FollowersList: React.FC<FollowersListProps> = ({ userId, type }) => {
  const [users, setUsers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [userId, type]);

  const fetchUsers = async () => {
    try {
      const endpoint = type === 'followers' ? '/api/follow/followers' : '/api/follow/following';
      const response = await fetch(`${endpoint}?user_id=${userId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data[type] || []);
      } else {
        console.error(`Failed to fetch ${type}`);
        addToast(`Failed to load ${type}`, 'error');
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      addToast(`Error loading ${type}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading {type}...</div>;
  }

  if (users.length === 0) {
    return (
      <div className="no-users">
        <p>No {type} yet</p>
      </div>
    );
  }

  return (
    <div className="followers-list">
      <h3>{type === 'followers' ? 'Followers' : 'Following'}</h3>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h4>{user.nickname}</h4>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowersList;
