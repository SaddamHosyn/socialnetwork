"use client";
import { useState } from "react";

const TestEventCreate = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <div>Overview Content</div>;
      case "create-event":
        return (
          <div style={{ padding: "2rem", background: "#f5f5f5", borderRadius: "8px" }}>
            <h2>Create Event Form</h2>
            <p>This is where the event creation form would be.</p>
            <form>
              <input type="text" placeholder="Event Title" style={{ width: "100%", padding: "8px", margin: "8px 0" }} />
              <textarea placeholder="Event Description" style={{ width: "100%", padding: "8px", margin: "8px 0" }} />
              <input type="datetime-local" style={{ width: "100%", padding: "8px", margin: "8px 0" }} />
              <button type="button" onClick={() => setActiveTab("overview")}>Cancel</button>
            </form>
          </div>
        );
      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Event Tab Test</h1>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            background: activeTab === "overview" ? "#007bff" : "#e0e0e0",
            color: activeTab === "overview" ? "white" : "black",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Overview
        </button>
        <button
          onClick={() => {
            console.log("Create Event clicked, setting activeTab to create-event");
            setActiveTab("create-event");
          }}
          style={{
            background: activeTab === "create-event" ? "#007bff" : "#e0e0e0",
            color: activeTab === "create-event" ? "white" : "black",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Event
        </button>
      </div>
      <div>
        <p>Current tab: {activeTab}</p>
        {renderContent()}
      </div>
    </div>
  );
};

export default TestEventCreate;
