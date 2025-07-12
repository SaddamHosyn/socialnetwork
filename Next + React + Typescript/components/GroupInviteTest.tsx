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
        if (response.ok) {
          const result = await response.json();
          console.log("Users result:", result);
          const userData = result.data || result || [];
          console.log("Setting users:", userData);
          setUsers(Array.isArray(userData) ? userData : []);
        } else {
          const errorText = await response.text();
          console.error("Users fetch failed:", response.status, errorText);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
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
          console.log("Groups result:", result);
          const groupData = result.data || result || [];
          console.log("Setting groups:", groupData);
          setGroups(Array.isArray(groupData) ? groupData : []);
        } else {
          const errorText = await response.text();
          console.error("Groups fetch failed:", response.status, errorText);
        }
      } catch (err) {
        console.error("Failed to fetch groups:", err);
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
        padding: "20px",
        border: "1px solid #ccc",
        margin: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>Test Group Invitations</h3>

      <div
        style={{
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <strong>Debug Info:</strong>
        <br />
        Groups loaded: {groups.length}
        <br />
        Users loaded: {users.length}
        {users.length > 0 && (
          <div>
            <br />
            Available users:{" "}
            {users.map((u) => u.nickname || u.email).join(", ")}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Select Group:</label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(Number(e.target.value))}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value={0}>-- Select a Group --</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Select User to Invite:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
          style={{ marginLeft: "10px", padding: "5px" }}
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
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Sending..." : "Send Invitation"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: message.includes("success")
              ? "#d4edda"
              : "#f8d7da",
            border: `1px solid ${
              message.includes("success") ? "#c3e6cb" : "#f5c6cb"
            }`,
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default GroupInviteTest;
