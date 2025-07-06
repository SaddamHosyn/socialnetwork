"use client";
import { useState, useEffect } from "react";
import { useGroups } from "../hooks/useGroups";
import type { GroupJoinRequest } from "../types/groups";

type Props = {
  onRequestHandled?: () => void;
};

const GroupJoinRequests: React.FC<Props> = ({ onRequestHandled }) => {
  const [requests, setRequests] = useState<GroupJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { getGroupJoinRequests, handleJoinRequest } = useGroups();

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      const requestData = await getGroupJoinRequests();
      setRequests(requestData);
      setLoading(false);
    };

    loadRequests();
  }, [getGroupJoinRequests]);

  const handleRequestResponse = async (
    requestId: number,
    action: "accept" | "decline"
  ) => {
    const success = await handleJoinRequest(requestId, action);
    if (success) {
      // Remove the handled request from the list
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      onRequestHandled?.();
    }
  };

  if (loading) return <div>Loading join requests...</div>;

  return (
    <div>
      <h2>Group Join Requests</h2>
      {requests.length === 0 ? (
        <div>No pending join requests.</div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {requests.map((request) => (
            <div key={request.id} className="post-card">
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>
                  {request.group_title}
                </h3>
                <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                  {request.user_nickname} wants to join
                </p>
                <div style={{ fontSize: "0.85rem", color: "#888" }}>
                  <span>
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => handleRequestResponse(request.id, "accept")}
                  style={{
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequestResponse(request.id, "decline")}
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
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupJoinRequests;
