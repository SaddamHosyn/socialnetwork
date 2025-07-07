"use client";
import React, { useState, useEffect } from "react";
import { UserList } from "./UserList";
import { FollowerSystem } from "./FollowerSystem";
import type { User } from "../types/types";

const PanelRight = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFollowerSystem, setShowFollowerSystem] = useState(false);

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.data.user.id);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch users list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        
        if (data.success) {
          setUsers(data.data || []);
        } else {
          setError(data.error || "Failed to load users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchUsers();
    }
  }, [currentUserId]);

  const handleUserClick = (user: User) => {
    // Here you can add navigation to user profile or chat
    console.log("User clicked:", user);
  };

  return (
    <aside id="right-panel" style={{ padding: "20px", borderLeft: "1px solid #ddd" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Active Users</h2>
        {!currentUserId && (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            Please login to see active users and use the follower system.
          </p>
        )}
        {currentUserId && loading && <p>Loading users...</p>}
        {currentUserId && error && <p style={{ color: "red" }}>{error}</p>}
        {currentUserId && !loading && !error && (
          <UserList 
            users={users} 
            currentUserId={currentUserId || undefined}
            onUserClick={handleUserClick}
          />
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <button 
          onClick={() => setShowFollowerSystem(!showFollowerSystem)}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "15px"
          }}
        >
          {showFollowerSystem ? "Hide" : "Show"} Follower System
        </button>
        
        {showFollowerSystem && currentUserId && (
          <FollowerSystem currentUserId={currentUserId} />
        )}
      </div>
    </aside>
  );
};

export default PanelRight;
