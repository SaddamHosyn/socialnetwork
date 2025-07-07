"use client";
import { useState } from "react";
import GroupList from "./GroupList";
import { GroupCreate } from "./GroupCreate";
import GroupInvitations from "./GroupInvitations";
import GroupJoinRequests from "./GroupJoinRequests";
import GroupPosts from "./GroupPost";
import GroupEventList from "./GroupEventList";
import GroupEventCreate from "./GroupEventCreate";
import type { Group } from "../types/groups";

type View =
  | "browse-all"
  | "my-groups"
  | "create-group"
  | "invitations"
  | "join-requests"
  | "group-details";

const Groups: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("browse-all");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setCurrentView("group-details");
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setCurrentView("browse-all");
  };

  const handleGroupCreated = () => {
    // Could fetch the created group details and navigate to it
    setCurrentView("my-groups");
  };

  const renderNavigation = () => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => setCurrentView("browse-all")}
        style={{
          background: currentView === "browse-all" ? "#007bff" : "#e9ecef",
          color: currentView === "browse-all" ? "white" : "#495057",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: currentView === "browse-all" ? "bold" : "normal",
        }}
      >
        Browse All Groups
      </button>

      <button
        onClick={() => setCurrentView("my-groups")}
        style={{
          background: currentView === "my-groups" ? "#007bff" : "#e9ecef",
          color: currentView === "my-groups" ? "white" : "#495057",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: currentView === "my-groups" ? "bold" : "normal",
        }}
      >
        My Groups
      </button>

      <button
        onClick={() => setCurrentView("create-group")}
        style={{
          background: currentView === "create-group" ? "#28a745" : "#e9ecef",
          color: currentView === "create-group" ? "white" : "#495057",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: currentView === "create-group" ? "bold" : "normal",
        }}
      >
        Create Group
      </button>

      <button
        onClick={() => setCurrentView("invitations")}
        style={{
          background: currentView === "invitations" ? "#ffc107" : "#e9ecef",
          color: currentView === "invitations" ? "black" : "#495057",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: currentView === "invitations" ? "bold" : "normal",
        }}
      >
        Invitations
      </button>

      <button
        onClick={() => setCurrentView("join-requests")}
        style={{
          background: currentView === "join-requests" ? "#6f42c1" : "#e9ecef",
          color: currentView === "join-requests" ? "white" : "#495057",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: currentView === "join-requests" ? "bold" : "normal",
        }}
      >
        Join Requests
      </button>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "browse-all":
        return (
          <GroupList onGroupClick={handleGroupClick} showMyGroups={false} />
        );

      case "my-groups":
        return (
          <GroupList onGroupClick={handleGroupClick} showMyGroups={true} />
        );

      case "create-group":
        return (
          <GroupCreate
            onSuccess={handleGroupCreated}
            onCancel={() => setCurrentView("browse-all")}
          />
        );

      case "invitations":
        return (
          <GroupInvitations
            onInvitationHandled={() => {
              // Refresh might be needed here
            }}
          />
        );

      case "join-requests":
        return (
          <GroupJoinRequests
            onRequestHandled={() => {
              // Refresh might be needed here
            }}
          />
        );

      case "group-details":
        return selectedGroup ? (
          <GroupDetailsWithPosts
            group={selectedGroup}
            onBack={handleBackToGroups}
          />
        ) : (
          <div>Group not found</div>
        );

      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0 0 1rem 0", fontSize: "2rem", color: "#333" }}>
          Groups
        </h1>
        <p style={{ margin: 0, color: "#666", fontSize: "1.1rem" }}>
          Create, join, and manage your groups. Connect with people who share
          your interests.
        </p>
      </div>

      {currentView !== "group-details" && renderNavigation()}

      <div style={{ minHeight: "400px" }}>{renderContent()}</div>
    </div>
  );
};

// Enhanced GroupDetails component that includes posts
const GroupDetailsWithPosts: React.FC<{
  group: Group;
  onBack: () => void;
}> = ({ group, onBack }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "posts" | "events" | "create-event"
  >("overview");

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
          </div>
        );

      case "posts":
        return <GroupPosts groupId={group.id} />;

      case "events":
        return <GroupEventList groupId={group.id} />;

      case "create-event":
        return (
          <GroupEventCreate
            groupId={group.id}
            onSuccess={() => setActiveTab("events")}
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
              onClick={() => setActiveTab("posts")}
              style={{
                background: "none",
                border: "none",
                padding: "8px 16px",
                cursor: "pointer",
                borderBottom:
                  activeTab === "posts"
                    ? "2px solid #007bff"
                    : "2px solid transparent",
                color: activeTab === "posts" ? "#007bff" : "#666",
                fontWeight: activeTab === "posts" ? "bold" : "normal",
              }}
            >
              Posts
            </button>

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

export default Groups;
