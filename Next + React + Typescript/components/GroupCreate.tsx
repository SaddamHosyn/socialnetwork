"use client";
import { useState } from "react";
import { useGroups } from "../hooks/useGroups";

type Props = {
  onSuccess?: (groupId: number) => void;
  onCancel: () => void;
};

const GroupCreate: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { createGroup, loading, error } = useGroups();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const result = await createGroup(title.trim(), description.trim());
    if (result) {
      onSuccess?.(result.group_id);
      onCancel();
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      <h2>Create New Group</h2>
      <input
        type="text"
        placeholder="Group Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={100}
        disabled={loading}
      />
      <textarea
        placeholder="Group Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        maxLength={500}
        rows={4}
        disabled={loading}
      />
      <div className="button-group">
        <button
          type="submit"
          disabled={loading || !title.trim() || !description.trim()}
        >
          {loading ? "Creating..." : "Create Group"}
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

export default GroupCreate;
