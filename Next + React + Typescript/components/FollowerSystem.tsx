import React, { useState, useEffect, useCallback } from 'react';
import { FollowStats } from './FollowStats';
import { FollowRequestsList } from './FollowRequestsList';
import { FollowersList } from './FollowersList';
import { UserList } from './UserList';
import { useFollower } from '../hooks/useFollower';
import { useToast } from '../hooks/useToast';
import type { FollowRequest, PublicUser } from '../types/types';
import './FollowerSystem.css';

interface FollowerSystemProps {
  currentUserId: number;
}

export const FollowerSystem: React.FC<FollowerSystemProps> = ({ currentUserId }) => {
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [showRequests, setShowRequests] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  const { getFollowRequests, getPublicUsers } = useFollower();
  const { addToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      // Load follow requests
      const requests = await getFollowRequests();
      setFollowRequests(requests);

      // Load users
      const usersData = await getPublicUsers();
      if (usersData?.users) {
        // Filter out current user
        const filteredUsers = usersData.users.filter((user: PublicUser) => user.id !== currentUserId);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error loading follower system data:', error);
      addToast('Failed to load data', 'error');
    }
  }, [currentUserId, getFollowRequests, getPublicUsers, addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRequestResponded = () => {
    // Reload requests after responding
    loadData();
  };

  const handleShowFollowers = () => {
    setSelectedUserId(currentUserId);
    setShowFollowers(true);
  };

  const handleShowFollowing = () => {
    setSelectedUserId(currentUserId);
    setShowFollowing(true);
  };

  return (
    <div className="follower-system">
      <h2>Social Network</h2>
      
      {/* Follow Requests Notification */}
      {followRequests.length > 0 && (
        <div className="follow-requests-notification">
          <button 
            className="requests-btn"
            onClick={() => setShowRequests(true)}
          >
            Follow Requests
            <span className="notification-badge">{followRequests.length}</span>
          </button>
        </div>
      )}

      {/* Current User Stats */}
      <div className="current-user-stats">
        <h3>Your Profile</h3>
        <FollowStats 
          userId={currentUserId}
          onFollowersClick={handleShowFollowers}
          onFollowingClick={handleShowFollowing}
        />
      </div>

      {/* Users List */}
      <div className="users-section">
        <h3>Discover Users</h3>
        <UserList users={users} currentUserId={currentUserId} />
      </div>

      {/* Modals */}
      <FollowRequestsList
        isOpen={showRequests}
        onClose={() => setShowRequests(false)}
        onRequestResponded={handleRequestResponded}
      />

      <FollowersList
        userId={selectedUserId || currentUserId}
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="Followers"
        type="followers"
      />

      <FollowersList
        userId={selectedUserId || currentUserId}
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        title="Following"
        type="following"
      />
    </div>
  );
};
