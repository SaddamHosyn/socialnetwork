"use client";
import { useState, useEffect } from "react";
import { useGroups } from "../hooks/useGroups";
import type { Group } from "../types/groups";

type Props = {
  onGroupClick?: (group: Group) => void;
  showMyGroups?: boolean;
};

const GroupList: React.FC<Props> = ({ onGroupClick, showMyGroups = false }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllGroups, getUserGroups, requestJoinGroup } = useGroups();

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      const groupData = showMyGroups
        ? await getUserGroups()
        : await getAllGroups();
      setGroups(groupData);
      setLoading(false);
    };

    loadGroups();
  }, [showMyGroups, getAllGroups, getUserGroups]);

  const handleJoinRequest = async (groupId: number) => {
    const success = await requestJoinGroup(groupId);
    if (success) {
      // Refresh the list
      const groupData = showMyGroups
        ? await getUserGroups()
        : await getAllGroups();
      setGroups(groupData);
    }
  };

  if (loading) return <div>Loading groups...</div>;

  return (
    <div>
      <h2>{showMyGroups ? "My Groups" : "All Groups"}</h2>
      {groups.length === 0 ? (
        <div>No groups found.</div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {groups.map((group) => (
            <div
              key={group.id}
              className="post-card"
              style={{ cursor: onGroupClick ? "pointer" : "default" }}
              onClick={() => onGroupClick?.(group)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>
                    {group.title}
                  </h3>
                  <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                    {group.description}
                  </p>
                  <div style={{ fontSize: "0.85rem", color: "#888" }}>
                    <span>By {group.creator_nickname}</span>
                    <span style={{ margin: "0 8px" }}>•</span>
                    <span>{group.member_count} members</span>
                    <span style={{ margin: "0 8px" }}>•</span>
                    <span>
                      {new Date(group.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ marginLeft: "1rem" }}>
                  {group.is_creator && (
                    <span
                      style={{
                        background: "#4CAF50",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                      }}
                    >
                      Creator
                    </span>
                  )}
                  {group.is_member && !group.is_creator && (
                    <span
                      style={{
                        background: "#2196F3",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                      }}
                    >
                      Member
                    </span>
                  )}
                  {!group.is_member && !showMyGroups && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinRequest(group.id);
                      }}
                      style={{
                        background: "#FF9800",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      Request Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;
