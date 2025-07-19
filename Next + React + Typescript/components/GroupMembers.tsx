"use client";
import { useState, useEffect } from "react";
import { getAvatarUrl } from "../utils/imageUtils";

interface Member {
  id: number;
  nickname: string;
  email: string;
  avatar_path?: string;
  joined_at: string;
  is_creator?: boolean;
}

interface GroupMembersProps {
  groupId: number;
  isGroupMember: boolean;
}

const GroupMembers = ({ groupId, isGroupMember }: GroupMembersProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/groups/members?group_id=${groupId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        const membersList = result.data || result || [];
        setMembers(membersList);
        setFilteredMembers(membersList);
      } else {
        throw new Error("Failed to fetch members");
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load group members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  return (
    <div className="members-section">
      <div className="members-header">
        <h2>Group Members ({members.length})</h2>
      </div>

      <div className="members-list">
        {loading ? (
          <div className="loading-spinner">Loading members...</div>
        ) : error ? (
          <div className="error-message">
            {error}
            <br />
            <button onClick={fetchMembers} className="retry-button">
              Try Again
            </button>
          </div>
        ) : members.length > 0 ? (
          members.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-avatar">
                <img
                  src={getAvatarUrl(member.avatar_path)}
                  alt={`${member.nickname}'s avatar`}
                  className="avatar-image"
                />
              </div>
              <div className="member-info">
                <div className="member-name">
                  {member.nickname}
                  {member.is_creator && (
                    <span className="creator-badge">👑 Creator</span>
                  )}
                </div>
                <div className="member-email">{member.email}</div>
                <div className="member-joined">
                  Joined: {new Date(member.joined_at).toLocaleDateString()}
                </div>
              </div>
              <div className="member-actions">
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No members found</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .members-section {
          max-width: 800px;
          margin: 0 auto;
        }

        .members-header {
          margin-bottom: 24px;
        }

        .members-header h2 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .search-bar {
          position: relative;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 25px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #007bff;
        }

        .search-input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .retry-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 12px;
          font-size: 14px;
        }

        .retry-button:hover {
          background: #0056b3;
        }

        .members-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .member-card {
          display: flex;
          align-items: center;
          padding: 16px;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s;
        }

        .member-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .member-avatar {
          margin-right: 16px;
        }

        .avatar-image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e1e5e9;
        }

        .member-info {
          flex: 1;
        }

        .member-name {
          font-weight: bold;
          color: #333;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .creator-badge {
          background: #ffd700;
          color: #333;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: normal;
        }

        .member-email {
          color: #666;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .member-joined {
          color: #888;
          font-size: 12px;
        }

        .member-actions {
          display: flex;
          gap: 8px;
        }

        .message-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.2s;
        }

        .message-btn:hover {
          background: #0056b3;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .loading-spinner,
        .error-message {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .error-message {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default GroupMembers;
