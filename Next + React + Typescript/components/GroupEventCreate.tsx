"use client";
import { useState } from "react";
import { useGroupEvents } from "../hooks/useGroupEvents";
type Props = {
  groupId: number;
  onSuccess?: (eventId: number) => void;
  onCancel: () => void;
};

const GroupEventCreate: React.FC<Props> = ({
  groupId,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const { createEvent, loading, error } = useGroupEvents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !eventDate) return;

    // Convert date to ISO format
    const result = await createEvent(
      groupId,
      title.trim(),
      description.trim(),
      eventDate
    );
    if (result) {
      onSuccess?.(result.event_id);
      onCancel();
      setTitle("");
      setDescription("");
      setEventDate("");
    }
  };

  // Get current date in YYYY-MM-DDTHH:MM format for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      <h2>Create Group Event</h2>
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={100}
        disabled={loading}
      />
      <textarea
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        maxLength={500}
        rows={4}
        disabled={loading}
      />
      <div>
        <label
          htmlFor="eventDate"
          style={{ display: "block", marginBottom: "8px" }}
        >
          Event Date & Time:
        </label>
        <input
          id="eventDate"
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          min={getCurrentDateTime()}
          required
          disabled={loading}
          style={{ width: "100%" }}
        />
      </div>
      <div className="button-group">
        <button
          type="submit"
          disabled={
            loading || !title.trim() || !description.trim() || !eventDate
          }
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
      {error && (
        <div className="form-error" style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default GroupEventCreate;
