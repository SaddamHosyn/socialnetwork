"use client";
import { useState, useEffect, useCallback } from "react";

type Comment = {
  id: number;
  content: string;
  author: string;
  created_at: string;
  image?: string;
};

type RawComment = {
  id: number;
  content: string;
  nickname: string;
  created_at: string;
  image?: string;
};

type Props = {
  postId: number;
};

const GroupComments: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadComments = useCallback(async () => {
    console.log("Loading comments for post ID:", postId);
    try {
      const response = await fetch(
        `/api/groups/posts/comments?post_id=${postId}`,
        {
          credentials: "include",
        }
      );
      console.log("Comment response status:", response.status);

      if (response.status === 401) {
        console.log("User not authenticated, redirecting to login");
        // Refresh the page to trigger re-authentication
        window.location.reload();
        return;
      }

      const data = await response.json();
      console.log("Comment response data:", data);
      if (data.success) {
        setComments(
          data.data.map((comment: RawComment) => ({
            id: comment.id,
            content: comment.content,
            author: comment.nickname,
            created_at: comment.created_at,
            image: comment.image,
          }))
        );
      } else {
        console.error("Failed to load comments:", data);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("post_id", postId.toString());
      formData.append("content", newComment.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/groups/posts/comments/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.status === 401) {
        console.log("User not authenticated, redirecting to login");
        window.location.reload();
        return;
      }

      const data = await response.json();

      if (data.success) {
        setNewComment("");
        setSelectedImage(null);
        loadComments(); // Refresh comments
      } else {
        console.error("Failed to create comment:", data);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
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

        {/* Image upload section */}
        <div style={{ marginTop: "8px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={posting}
            style={{ display: "none" }}
            id={`image-upload-${postId}`}
          />
          <label
            htmlFor={`image-upload-${postId}`}
            style={{
              display: "inline-block",
              padding: "4px 8px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
              marginRight: "8px",
            }}
          >
            📷 Add Image
          </label>

          {selectedImage && (
            <div
              style={{
                marginTop: "8px",
                padding: "8px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "0.8rem" }}>{selectedImage.name}</span>
              <button
                type="button"
                onClick={removeImage}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc3545",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

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
            {comment.image && (
              <div style={{ marginTop: "8px" }}>
                <img
                  src={`http://localhost:8080${comment.image.replace(
                    /^\./,
                    ""
                  )}`}
                  alt="Comment image"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}
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
