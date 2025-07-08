import React, { useState, useEffect } from 'react';
import { useFollower } from '../hooks/useFollower';
import { useToast } from '../hooks/useToast';

interface FollowButtonProps {
  userId: number;
  onFollowChange?: (status: string) => void;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  onFollowChange,
  className = ''
}) => {
  const [followStatus, setFollowStatus] = useState<'following' | 'pending' | 'not_following'>('not_following');
  const { loading, followUser, unfollowUser, getFollowStatus } = useFollower();
  const { addToast } = useToast();

  useEffect(() => {
    const loadFollowStatus = async () => {
      const status = await getFollowStatus(userId);
      if (status) {
        setFollowStatus(status.follow_status);
      }
    };

    loadFollowStatus();
  }, [userId, getFollowStatus]);

  const handleFollow = async () => {
    const result = await followUser(userId);
    if (result) {
      setFollowStatus(result.status);
      onFollowChange?.(result.status);
      addToast(result.message, 'success');
    } else {
      addToast('Failed to follow user', 'error');
    }
  };

  const handleUnfollow = async () => {
    const result = await unfollowUser(userId);
    if (result) {
      setFollowStatus('not_following');
      onFollowChange?.('not_following');
      addToast(result.message, 'success');
    } else {
      addToast('Failed to unfollow user', 'error');
    }
  };

  const renderButton = () => {
    if (loading) {
      return (
        <button disabled className={`follow-button loading ${className}`}>
          Loading...
        </button>
      );
    }

    switch (followStatus) {
      case 'following':
        return (
          <button
            onClick={handleUnfollow}
            className={`follow-button unfollow-btn ${className}`}
          >
            Unfollow
          </button>
        );
      case 'pending':
        return (
          <span className={`follow-button pending-status ${className}`}>
            Request Sent
          </span>
        );
      case 'not_following':
      default:
        return (
          <button
            onClick={handleFollow}
            className={`follow-button follow-btn ${className}`}
          >
            Follow
          </button>
        );
    }
  };

  return (
    <div className="follow-button-container">
      {renderButton()}
    </div>
  );
};
