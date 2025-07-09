"use client";
import { useState } from "react";

type Props = {
  groupId: number;
  onSuccess: () => void;
  onCancel: () => void;
};

const GroupPostCreate: React.FC<Props> = ({ groupId, onSuccess, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("group_id", groupId.toString());
      formData.append("title", title.trim());
      formData.append("content", content.trim());

      const response = await fetch("/api/groups/posts/create", {
        method: "POST",
        credentials: "include",
        body: formData, // No need to set Content-Type with FormData
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        setTitle("");
        setContent("");
      } else {
        setError(data.error || "Failed to create post");
      }
    } catch {
      setError("An error occurred while creating the post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-wrapper">
      <h3>Create Group Post</h3>

      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          Title *
        </label>
        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem",
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          Description *
        </label>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={2000}
          rows={4}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem",
            resize: "vertical",
          }}
        />
      </div>

      <div className="button-group">
        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim()}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            opacity: loading || !title.trim() || !content.trim() ? 0.6 : 1,
          }}
        >
          {loading ? "Posting..." : "Post"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            background: "#6c757d",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            marginLeft: "8px",
          }}
        >
          Cancel
        </button>
      </div>
      {error && (
        <div style={{ color: "red", marginTop: "1rem", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default GroupPostCreate;
