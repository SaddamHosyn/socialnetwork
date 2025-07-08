"use client";
import { useState, useEffect } from "react";

type Comment = {
  id: number;
  content: string;
  author: string;
  created_at: string;
};

type Props = {
  postId: number;
};

const GroupComments: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadComments = async () => {
    try {
      const response = await fetch(
        `/api/groups/posts/comments?post_id=${postId}`
      );
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const formData = new URLSearchParams();
      formData.append("post_id", postId.toString());
      formData.append("content", newComment.trim());

      const response = await fetch("/api/groups/posts/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setNewComment("");
        loadComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          disabled={posting}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "0.9rem",
            resize: "vertical",
          }}
        />
        <button
          type="submit"
          disabled={posting || !newComment.trim()}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.8rem",
            marginTop: "8px",
            opacity: posting || !newComment.trim() ? 0.6 : 1,
          }}
        >
          {posting ? "Posting..." : "Comment"}
        </button>
      </form>

      <div style={{ display: "grid", gap: "1rem" }}>
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: "0.75rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              fontSize: "0.9rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <strong>{comment.author}</strong>
              <span style={{ color: "#666", fontSize: "0.8rem" }}>
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>{comment.content}</div>
          </div>
        ))}

        {comments.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupComments;
