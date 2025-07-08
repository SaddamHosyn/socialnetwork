"use client";
import { useState, useEffect } from "react";
import { useGroups } from "../hooks/useGroups";
import type { GroupInvitation } from "../types/groups";

type Props = {
  onInvitationHandled?: () => void;
};

const GroupInvitations: React.FC<Props> = ({ onInvitationHandled }) => {
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { getGroupInvitations, handleInvitation } = useGroups();

  useEffect(() => {
    const loadInvitations = async () => {
      setLoading(true);
      const invitationData = await getGroupInvitations();
      setInvitations(invitationData);
      setLoading(false);
    };

    loadInvitations();
  }, [getGroupInvitations]);

  const handleInvitationResponse = async (
    invitationId: number,
    action: "accept" | "decline"
  ) => {
    const success = await handleInvitation(invitationId, action);
    if (success) {
      // Remove the handled invitation from the list
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      onInvitationHandled?.();
    }
  };

  if (loading) return <div>Loading invitations...</div>;

  return (
    <div>
      <h2>Group Invitations</h2>
      {invitations.length === 0 ? (
        <div>No pending invitations.</div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {invitations.map((invitation) => (
            <div key={invitation.id} className="post-card">
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>
                  {invitation.group_title}
                </h3>
                <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                  Invited by {invitation.inviter_nickname}
                </p>
                <div style={{ fontSize: "0.85rem", color: "#888" }}>
                  <span>
                    {new Date(invitation.created_at).toLocaleDateString()}
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
                  onClick={() =>
                    handleInvitationResponse(invitation.id, "accept")
                  }
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
                  onClick={() =>
                    handleInvitationResponse(invitation.id, "decline")
                  }
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

export default GroupInvitations;
