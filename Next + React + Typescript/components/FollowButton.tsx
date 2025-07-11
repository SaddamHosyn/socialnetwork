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
    const baseButtonStyle = {
      padding: "0.4rem 0.8rem",
      fontSize: "0.8rem",
      fontWeight: "500",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      minWidth: "80px",
      textAlign: "center" as const,
      display: "inline-block",
      lineHeight: "1.2"
    };

    if (loading) {
      return (
        <button 
          disabled 
          style={{
            ...baseButtonStyle,
            backgroundColor: "#6c757d",
            color: "white",
            cursor: "not-allowed",
            opacity: 0.7
          }}
        >
          Loading...
        </button>
      );
    }

    switch (followStatus) {
      case 'following':
        return (
          <button
            onClick={handleUnfollow}
            style={{
              ...baseButtonStyle,
              backgroundColor: "#dc3545",
              color: "white",
              border: "1px solid #dc3545"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#c82333";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#dc3545";
            }}
          >
            Unfollow
          </button>
        );
      case 'pending':
        return (
          <span 
            style={{
              ...baseButtonStyle,
              backgroundColor: "#ffc107",
              color: "#212529",
              border: "1px solid #ffc107",
              cursor: "default"
            }}
          >
            Request Sent
          </span>
        );
      case 'not_following':
      default:
        return (
          <button
            onClick={handleFollow}
            style={{
              ...baseButtonStyle,
              backgroundColor: "#007bff",
              color: "white",
              border: "1px solid #007bff"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#0056b3";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff";
            }}
          >
            Follow
          </button>
        );
    }
  };

  return (
    <div className={className} style={{ display: "inline-block" }}>
      {renderButton()}
    </div>
  );
};
