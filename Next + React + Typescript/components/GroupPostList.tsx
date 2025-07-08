"use client";
import { useState } from "react";
import type { GroupPost } from "../types/groups";
import GroupComments from "./GroupComments";

type Props = {
  posts: GroupPost[];
  onPostUpdate: () => void;
};

const GroupPostList: React.FC<Props> = ({ posts, onPostUpdate }) => {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const toggleComments = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (posts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "#666",
          fontSize: "1.1rem",
        }}
      >
        No posts yet. Be the first to share something!
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                <strong>{post.nickname}</strong>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#888" }}>
                {formatDate(post.created_at)}
              </div>
            </div>

            <div
              style={{
                fontSize: "1rem",
                lineHeight: "1.6",
                color: "#333",
                marginBottom: "1rem",
              }}
            >
              {post.content}
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                paddingTop: "0.5rem",
                borderTop: "1px solid #eee",
              }}
            >
              <button
                onClick={() => toggleComments(post.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  padding: "4px 8px",
                }}
              >
                {expandedPost === post.id ? "Hide" : "Show"} Comments (
                {post.comments_count || 0})
              </button>

              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                👍 {post.votes || 0}
              </div>
            </div>
          </div>

          {expandedPost === post.id && (
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #eee",
              }}
            >
              <GroupComments postId={post.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupPostList;
