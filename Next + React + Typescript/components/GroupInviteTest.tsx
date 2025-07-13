"use client";
import { useState, useEffect } from "react";
import { useGroups } from "../hooks/useGroups";

interface User {
  id: number;
  nickname: string;
  email: string;
}

interface Group {
  id: number;
  title: string;
}

const GroupInviteTest: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const { inviteToGroup, loading } = useGroups();

  useEffect(() => {
    // Fetch users - you'll need to implement this endpoint if it doesn't exist
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await fetch("/api/users", { credentials: "include" });
        console.log("Users response status:", response.status);
        console.log(
          "Users response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Users result full:", result);

          // Handle different response structures
          let userData = [];
          if (result.success && result.data) {
            userData = result.data;
          } else if (result.data) {
            userData = result.data;
          } else if (Array.isArray(result)) {
            userData = result;
          } else {
            console.log("Unexpected user data structure:", result);
          }

          console.log("Final userData to set:", userData);
          console.log("Is userData an array?", Array.isArray(userData));

          if (Array.isArray(userData) && userData.length > 0) {
            console.log("First user:", userData[0]);
            setUsers(userData);
          } else {
            console.log("No valid user data found or empty array");
            setUsers([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Users fetch failed:", response.status, errorText);
          setUsers([]);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      }
    };

    // Fetch groups
    const fetchGroups = async () => {
      try {
        console.log("Fetching groups...");
        const response = await fetch("/api/groups", { credentials: "include" });
        console.log("Groups response status:", response.status);

        if (response.ok) {
          const result = await response.json();
          console.log("Groups result full:", result);

          // Handle different response structures
          let groupData = [];
          if (result.success && result.data) {
            groupData = result.data;
          } else if (result.data) {
            groupData = result.data;
          } else if (Array.isArray(result)) {
            groupData = result;
          } else {
            console.log("Unexpected group data structure:", result);
          }

          console.log("Final groupData to set:", groupData);
          console.log("Is groupData an array?", Array.isArray(groupData));

          if (Array.isArray(groupData) && groupData.length > 0) {
            console.log("First group:", groupData[0]);
            setGroups(groupData);
          } else {
            console.log("No valid group data found or empty array");
            setGroups([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Groups fetch failed:", response.status, errorText);
          setGroups([]);
        }
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setGroups([]);
      }
    };

    fetchUsers();
    fetchGroups();
  }, []);

  const handleSendInvitation = async () => {
    if (!selectedGroup || !selectedUser) {
      setMessage("Please select both a group and a user");
      return;
    }

    try {
      const result = await inviteToGroup(selectedGroup, selectedUser);
      setMessage(result.message);
    } catch (err) {
      setMessage("Failed to send invitation");
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h3
        style={{
          color: "#2d3748",
          marginBottom: "24px",
          fontSize: "24px",
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Send Group Invitations
      </h3>

      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: "#f7fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ color: "#4a5568", fontSize: "14px", lineHeight: "1.5" }}>
          <div>
            <strong>Groups available:</strong> {groups.length}
          </div>
          <div>
            <strong>Users available:</strong> {users.length}
          </div>
          {groups.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <strong>Groups:</strong> {groups.map((g) => g.title).join(", ")}
            </div>
          )}
          {users.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <strong>Users:</strong>{" "}
              {users.map((u) => u.nickname || u.email).join(", ")}
            </div>
          )}
          {users.length === 0 && (
            <div style={{ marginTop: "8px", color: "#e53e3e" }}>
              <strong>⚠️ No users loaded!</strong>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Check the console for errors. Make sure you are logged in and
                that there are other users in the database.
              </div>
            </div>
          )}
          {groups.length === 0 && (
            <div style={{ marginTop: "8px", color: "#e53e3e" }}>
              <strong>⚠️ No groups loaded!</strong>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Check the console for errors. You may need to create a group
                first.
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "500",
            color: "#2d3748",
            fontSize: "14px",
          }}
        >
          Select Group:
        </label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "14px",
            backgroundColor: "#ffffff",
            transition: "border-color 0.2s",
            outline: "none",
          }}
          onFocus={(e) =>
            ((e.target as HTMLSelectElement).style.borderColor = "#6f42c1")
          }
          onBlur={(e) =>
            ((e.target as HTMLSelectElement).style.borderColor = "#e2e8f0")
          }
        >
          <option value={0}>-- Select a Group --</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "500",
            color: "#2d3748",
            fontSize: "14px",
          }}
        >
          Select User to Invite:
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "14px",
            backgroundColor: "#ffffff",
            transition: "border-color 0.2s",
            outline: "none",
          }}
          onFocus={(e) =>
            ((e.target as HTMLSelectElement).style.borderColor = "#6f42c1")
          }
          onBlur={(e) =>
            ((e.target as HTMLSelectElement).style.borderColor = "#e2e8f0")
          }
        >
          <option value={0}>-- Select a User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nickname} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSendInvitation}
        disabled={loading || !selectedGroup || !selectedUser}
        style={{
          width: "100%",
          padding: "14px 24px",
          backgroundColor:
            loading || !selectedGroup || !selectedUser ? "#e2e8f0" : "#6f42c1",
          color:
            loading || !selectedGroup || !selectedUser ? "#a0aec0" : "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "500",
          cursor:
            loading || !selectedGroup || !selectedUser
              ? "not-allowed"
              : "pointer",
          transition: "all 0.2s",
          boxShadow:
            loading || !selectedGroup || !selectedUser
              ? "none"
              : "0 2px 4px rgba(111, 66, 193, 0.3)",
        }}
        onMouseEnter={(e) => {
          if (!loading && selectedGroup && selectedUser) {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = "#553c9a";
            target.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && selectedGroup && selectedUser) {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = "#6f42c1";
            target.style.transform = "translateY(0)";
          }
        }}
      >
        {loading ? "Sending Invitation..." : "Send Invitation"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor:
              message.includes("success") || message.includes("sent")
                ? "#f0fff4"
                : "#fef5e7",
            border: `2px solid ${
              message.includes("success") || message.includes("sent")
                ? "#68d391"
                : "#f6ad55"
            }`,
            borderRadius: "8px",
            color:
              message.includes("success") || message.includes("sent")
                ? "#2f855a"
                : "#c05621",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default GroupInviteTest;
