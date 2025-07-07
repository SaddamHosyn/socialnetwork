"use client";
import { useState } from "react";
import GroupList from "./GroupList";
import GroupCreate from "./GroupCreate";
import GroupDetails from "./GroupDetails";
import GroupInvitations from "./GroupInvitations";
import GroupJoinRequests from "./GroupJoinRequests";
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

  const handleGroupCreated = (groupId: number) => {
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
          <GroupDetails
            groupId={selectedGroup.id}
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

export default Groups;
