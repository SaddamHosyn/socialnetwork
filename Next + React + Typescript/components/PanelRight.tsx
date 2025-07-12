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
        console.log('Fetching users...');
        setLoading(true);
        const response = await fetch("/api/users");
        
        console.log('Users response status:', response.status);
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        console.log('Users data:', data);
        
        if (data.success) {
          setUsers(data.data || []);
          console.log('Users loaded:', data.data?.length || 0);
        } else {
          setError(data.error || "Failed to load users");
          console.error('Users fetch error:', data.error);
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
    <aside 
      id="right-panel" 
      style={{ 
        padding: "20px", 
        borderLeft: "1px solid #ddd",
        width: "300px",
        minWidth: "280px",
        maxWidth: "320px",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div style={{ 
        marginBottom: "20px",
        flex: "1",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <h2 style={{
          margin: "0 0 1rem 0",
          fontSize: "1.2rem",
          fontWeight: "600",
          color: "#333"
        }}>
          Active Users
        </h2>
        {!currentUserId && (
          <p style={{ 
            color: "#666", 
            fontStyle: "italic",
            fontSize: "0.9rem",
            lineHeight: "1.4"
          }}>
            Please login to see active users and use the follower system.
          </p>
        )}
        {currentUserId && loading && (
          <p style={{
            color: "#666",
            fontSize: "0.9rem",
            textAlign: "center",
            padding: "2rem 0"
          }}>
            Loading users...
          </p>
        )}
        {currentUserId && error && (
          <p style={{ 
            color: "#dc3545", 
            fontSize: "0.9rem",
            backgroundColor: "#f8d7da",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #f5c6cb"
          }}>
            {error}
          </p>
        )}
        {currentUserId && !loading && !error && (
          <div style={{ 
            flex: "1", 
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            <UserList 
              users={users} 
              currentUserId={currentUserId || undefined}
              onUserClick={handleUserClick}
            />
          </div>
        )}
        
        {currentUserId && (
          <div style={{
            marginTop: "1rem",
            textAlign: "center"
          }}>
            <button
              onClick={() => setShowFollowerSystem(!showFollowerSystem)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: showFollowerSystem ? "#dc3545" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                transition: "background-color 0.2s"
              }}
            >
              {showFollowerSystem ? "Hide Follower System" : "Show Follower System"}
            </button>
          </div>
        )}
      </div>

      {showFollowerSystem && currentUserId && (
        <div style={{
          borderTop: "1px solid #e9ecef",
          paddingTop: "1rem",
          marginTop: "1rem"
        }}>
          <FollowerSystem currentUserId={currentUserId} />
        </div>
      )}
    </aside>
  );
};

export default PanelRight;
