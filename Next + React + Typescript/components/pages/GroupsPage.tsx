"use client";
import { useState } from "react";

const GroupsPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");

  return (
    <div className="groups-page">
      <div className="page-header">
        <h1>Groups</h1>
        <button onClick={() => setViewMode("create")} className="create-button">
          + Create Group
        </button>
      </div>

      {viewMode === "list" && (
        <div className="groups-content">
          <div className="groups-grid">
            <div className="group-card">
              <h3>General Discussion</h3>
              <p>A place for general conversations and discussions</p>
              <div className="group-meta">
                <span>125 members</span>
                <button className="join-button">Join</button>
              </div>
            </div>
            <div className="group-card">
              <h3>Tech Talk</h3>
              <p>Discussions about technology, programming, and development</p>
              <div className="group-meta">
                <span>89 members</span>
                <button className="join-button">Join</button>
              </div>
            </div>
            <div className="group-card">
              <h3>Creative Corner</h3>
              <p>Share your creative projects and get feedback</p>
              <div className="group-meta">
                <span>67 members</span>
                <button className="join-button">Join</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === "create" && (
        <div className="create-group-view">
          <div className="page-header">
            <button onClick={() => setViewMode("list")} className="back-button">
              ← Back to Groups
            </button>
            <h2>Create New Group</h2>
          </div>
          <div className="create-group-form">
            <form>
              <div className="form-group">
                <label>Group Name</label>
                <input type="text" placeholder="Enter group name" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your group" rows={4}></textarea>
              </div>
              <div className="form-group">
                <label>Privacy</label>
                <select>
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setViewMode("list")}>
                  Cancel
                </button>
                <button type="submit">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
