"use client";
import { useState } from "react";

// Mock data for demonstration
const mockPost = {
  id: 1,
  group_id: 1,
  title: "Test Group Post",
  content: "This is a test post to demonstrate the comment system",
  author_id: 1,
  nickname: "TestUser",
  created_at: "2025-01-09T20:00:00Z",
  comments_count: 2,
  votes: 5,
  image_paths: [],
};

const mockComments = [
  {
    id: 1,
    post_id: 1,
    user_id: 1,
    nickname: "Alice",
    content: "Great post!",
    image: "",
    created_at: "2025-01-09T20:01:00Z",
  },
  {
    id: 2,
    post_id: 1,
    user_id: 2,
    nickname: "Bob",
    content: "I agree with this!",
    image: "",
    created_at: "2025-01-09T20:02:00Z",
  },
];

export default function TestGroupPostComments() {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      post_id: mockPost.id,
      user_id: 3,
      nickname: "CurrentUser",
      content: newComment.trim(),
      image: "",
      created_at: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Group Post Comment System Demo</h1>

      <div
        className="post-card"
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        {/* Post Header */}
        <div style={{ fontSize: 12, color: "#888", marginBottom: "0.5rem" }}>
          <span>
            {mockPost.nickname} ·{" "}
            {new Date(mockPost.created_at).toLocaleString()}
          </span>
        </div>

        {/* Post Content */}
        <div
          style={{ fontSize: 22, fontWeight: "bold", marginBottom: "0.5rem" }}
        >
          {mockPost.title}
        </div>
        <div style={{ fontSize: 16, marginBottom: "0.5rem" }}>
          {mockPost.content}
        </div>

        {/* Post Actions */}
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "0.5rem",
            borderTop: "1px solid #eee",
          }}
        >
          <span style={{ marginRight: "1rem", color: "#666" }}>
            {mockPost.votes} votes
          </span>
          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            💬 {showComments ? "Hide" : "Show"} Comments (
            {mockPost.comments_count})
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #eee",
            }}
          >
            {/* Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              style={{ marginBottom: "1rem" }}
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
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
                disabled={!newComment.trim()}
                style={{
                  marginTop: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  opacity: !newComment.trim() ? 0.6 : 1,
                }}
              >
                Post Comment
              </button>
            </form>

            {/* Comments List */}
            <div style={{ display: "grid", gap: "1rem" }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <strong>{comment.nickname}</strong>
                    <span style={{ color: "#666", fontSize: "0.8rem" }}>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    {comment.content}
                  </div>
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
        )}
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f0f8ff",
          borderRadius: "8px",
        }}
      >
        <h3>How it works:</h3>
        <ol>
          <li>Click "Show Comments" to expand the comment section</li>
          <li>Type in the comment box and click "Post Comment"</li>
          <li>Comments appear in real-time below the form</li>
          <li>The system supports image uploads (not shown in this demo)</li>
        </ol>
        <p>
          <strong>Note:</strong> In the real application, this only works when
          you're logged in and are a member of the group.
        </p>
      </div>
    </div>
  );
}
