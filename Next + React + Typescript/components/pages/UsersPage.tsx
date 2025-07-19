"use client";
import { useState, useEffect } from "react";
import { FollowButton } from "../FollowButton";
import { useFollower } from "../../hooks/useFollower";
import { getAvatarUrl, getUserInitials } from "../../utils/imageUtils";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  nickname?: string;
  about_me?: string;
  is_private: boolean;
  followers_count: number;
  following_count: number;
  follow_status: "following" | "pending" | "not_following";
}

interface UsersPageProps {
  onUserClick?: (userId: number) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ onUserClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { loading: followLoading } = useFollower();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/discover", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        if (data.success) {
          setUsers(data.data || []);
        } else {
          setError(data.message || "Failed to load users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFollowChange = (userId: number, status: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              follow_status: status as
                | "following"
                | "pending"
                | "not_following",
            }
          : user
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="users-page">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <div className="error-section">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Discover Users</h1>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <p>No users found.</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="user-card clickable-card"
              onClick={() => onUserClick?.(user.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="user-avatar">
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={`${user.nickname || user.first_name}'s avatar`}
                />
              </div>

              <div className="user-info">
                <h3
                  className="user-nickname clickable"
                  style={{ color: "#007bff" }}
                >
                  {user.nickname || `${user.first_name} ${user.last_name}`}
                </h3>
                {user.nickname && (
                  <p className="user-name">
                    {user.first_name} {user.last_name}
                  </p>
                )}

                <div className="user-stats">
                  <span className="stat">
                    <strong>{user.followers_count}</strong> followers
                  </span>
                  <span className="stat">
                    <strong>{user.following_count}</strong> following
                  </span>
                </div>

                <div className="user-privacy">
                  {user.is_private ? (
                    <span className="privacy-badge private">🔒 Private</span>
                  ) : (
                    <span className="privacy-badge public">🌐 Public</span>
                  )}
                </div>
              </div>

              <div
                className="user-actions"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <FollowButton
                  userId={user.id}
                  onFollowChange={(status) =>
                    handleFollowChange(user.id, status)
                  }
                  className="follow-btn"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersPage;
