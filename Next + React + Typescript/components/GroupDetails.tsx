"use client";
import { useState, useEffect } from "react";
import { useGroups } from "../hooks/useGroups";
import type { Group } from "../types/groups";
import GroupEventList from "./GroupEventList";
import GroupEventCreate from "./GroupEventCreate";

type Props = {
  groupId: number;
  onBack?: () => void;
};

const GroupDetails: React.FC<Props> = ({ groupId, onBack }) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "create-event"
  >("overview");
  const { getGroupDetails, leaveGroup } = useGroups();

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      const groupData = await getGroupDetails(groupId);
      setGroup(groupData);
      setLoading(false);
    };

    loadGroup();
  }, [groupId, getGroupDetails]);

  const handleLeaveGroup = async () => {
    if (!group || group.is_creator) return;

    const confirmed = window.confirm(
      "Are you sure you want to leave this group?"
    );
    if (!confirmed) return;

    const success = await leaveGroup(groupId);
    if (success) {
      onBack?.();
    }
  };

  const handleEventCreated = () => {
    setActiveTab("events");
  };

  if (loading) return <div>Loading group details...</div>;

  if (!group) return <div>Group not found.</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <h2>Group Overview</h2>
            <div className="post-card">
              <h3 style={{ margin: "0 0 12px 0", fontSize: "1.4rem" }}>
                {group.title}
              </h3>
              <p
                style={{
                  margin: "0 0 16px 0",
                  color: "#666",
                  lineHeight: "1.6",
                }}
              >
                {group.description}
              </p>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#888",
                  marginBottom: "16px",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <strong>Creator:</strong> {group.creator_nickname}
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Members:</strong> {group.member_count}
                </div>
                <div>
                  <strong>Created:</strong>{" "}
                  {new Date(group.created_at).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
              </div>
            </div>

            {group.is_member && !group.is_creator && (
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={handleLeaveGroup}
                  style={{
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Leave Group
                </button>
              </div>
            )}
          </div>
        );

      case "events":
        return <GroupEventList groupId={groupId} />;

      case "create-event":
        return (
          <GroupEventCreate
            groupId={groupId}
            onSuccess={handleEventCreated}
            onCancel={() => setActiveTab("events")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: 0 }}>{group.title}</h1>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "#6c757d",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            background: "none",
            border: "none",
            padding: "8px 16px",
            cursor: "pointer",
            borderBottom:
              activeTab === "overview"
                ? "2px solid #007bff"
                : "2px solid transparent",
            color: activeTab === "overview" ? "#007bff" : "#666",
            fontWeight: activeTab === "overview" ? "bold" : "normal",
          }}
        >
          Overview
        </button>

        {group.is_member && (
          <>
            <button
              onClick={() => setActiveTab("events")}
              style={{
                background: "none",
                border: "none",
                padding: "8px 16px",
                cursor: "pointer",
                borderBottom:
                  activeTab === "events"
                    ? "2px solid #007bff"
                    : "2px solid transparent",
                color: activeTab === "events" ? "#007bff" : "#666",
                fontWeight: activeTab === "events" ? "bold" : "normal",
              }}
            >
              Events
            </button>

            <button
              onClick={() => setActiveTab("create-event")}
              style={{
                background: "none",
                border: "none",
                padding: "8px 16px",
                cursor: "pointer",
                borderBottom:
                  activeTab === "create-event"
                    ? "2px solid #007bff"
                    : "2px solid transparent",
                color: activeTab === "create-event" ? "#007bff" : "#666",
                fontWeight: activeTab === "create-event" ? "bold" : "normal",
              }}
            >
              Create Event
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default GroupDetails;
