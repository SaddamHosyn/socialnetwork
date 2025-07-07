import React, { useState, useEffect } from 'react';
import { useFollower } from '../hooks/useFollower';
import type { Follower } from '../types/types';

interface FollowStatsProps {
  userId: number;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export const FollowStats: React.FC<FollowStatsProps> = ({
  userId,
  onFollowersClick,
  onFollowingClick
}) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const { getFollowers, getFollowing } = useFollower();

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [followersData, followingData] = await Promise.all([
        getFollowers(userId),
        getFollowing(userId)
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
    } catch (error) {
      console.error('Error loading follow stats:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="follow-stats loading">Loading stats...</div>;
  }

  return (
    <div className="follow-stats">
      <button 
        className="stat-button"
        onClick={onFollowersClick}
        type="button"
      >
        <strong>{followers.length}</strong> Followers
      </button>
      
      <button 
        className="stat-button"
        onClick={onFollowingClick}
        type="button"
      >
        <strong>{following.length}</strong> Following
      </button>
    </div>
  );
};
