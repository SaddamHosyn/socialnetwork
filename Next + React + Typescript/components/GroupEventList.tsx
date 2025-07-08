"use client";
import { useState, useEffect } from "react";
import { useGroupEvents } from "../hooks/useGroupEvents";
import type { GroupEvent } from "../types/groups";

type Props = {
  groupId: number;
  onEventClick?: (event: GroupEvent) => void;
};

const GroupEventList: React.FC<Props> = ({ groupId, onEventClick }) => {
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { getGroupEvents, respondToEvent } = useGroupEvents();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const eventData = await getGroupEvents(groupId);
      setEvents(eventData);
      setLoading(false);
    };

    loadEvents();
  }, [groupId, getGroupEvents]);

  const handleResponse = async (
    eventId: number,
    response: "going" | "not_going"
  ) => {
    const success = await respondToEvent(eventId, response);
    if (success) {
      // Refresh the events list
      const eventData = await getGroupEvents(groupId);
      setEvents(eventData);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div>
      <h2>Group Events</h2>
      {events.length === 0 ? (
        <div>No events found.</div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {events.map((event) => (
            <div
              key={event.id}
              className="post-card"
              style={{ cursor: onEventClick ? "pointer" : "default" }}
              onClick={() => onEventClick?.(event)}
            >
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>
                  {event.title}
                </h3>
                <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                  {event.description}
                </p>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#888",
                    marginBottom: "12px",
                  }}
                >
                  <strong>📅 {formatEventDate(event.event_date)}</strong>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#888" }}>
                  <span>Created by {event.creator_nickname}</span>
                  <span style={{ margin: "0 8px" }}>•</span>
                  <span>{new Date(event.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #eee",
                  paddingTop: "12px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "16px", fontSize: "0.9rem" }}
                >
                  <span style={{ color: "#4CAF50" }}>
                    ✓ Going: {event.going_count}
                  </span>
                  <span style={{ color: "#f44336" }}>
                    ✗ Not Going: {event.not_going_count}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResponse(event.id, "going");
                    }}
                    style={{
                      background:
                        event.user_response === "going" ? "#4CAF50" : "#e0e0e0",
                      color: event.user_response === "going" ? "white" : "#666",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Going
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResponse(event.id, "not_going");
                    }}
                    style={{
                      background:
                        event.user_response === "not_going"
                          ? "#f44336"
                          : "#e0e0e0",
                      color:
                        event.user_response === "not_going" ? "white" : "#666",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Not Going
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupEventList;
