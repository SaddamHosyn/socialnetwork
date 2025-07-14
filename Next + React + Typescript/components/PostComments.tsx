"use client";
import { useState, useEffect, useCallback } from "react";

type Comment = {
  id: number;
  user_id: number;
  nickname: string;
  content: string;
  image?: string;
  created_at: string;
  votes: number;
};

type Props = {
  postId: number;
  isVisible: boolean;
};

const PostComments: React.FC<Props> = ({ postId, isVisible }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const loadComments = useCallback(async () => {
    if (!isVisible) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/comment/fetch?post_id=${postId}&limit=50`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setComments(data.data || []);
        }
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, isVisible]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        alert("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image must be smaller than 10MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newComment.trim() && !selectedImage) || posting) return;

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("post_id", postId.toString());
      formData.append("content", newComment.trim());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/comment/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNewComment("");
          removeImage();
          loadComments(); // Refresh comments
        }
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPosting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="post-comments"
      style={{
        marginTop: "16px",
        padding: "16px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
      }}
    >
      {/* Comment form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
        <textarea
          placeholder={
            selectedImage ? "Add a caption (optional)..." : "Write a comment..."
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          disabled={posting}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            resize: "vertical",
            boxSizing: "border-box",
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
              padding: "6px 12px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: posting ? "not-allowed" : "pointer",
              fontSize: "12px",
              color: "#495057",
            }}
          >
            📷 Add Image
          </label>
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div
            style={{
              marginTop: "8px",
              position: "relative",
              display: "inline-block",
            }}
          >
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "200px",
                maxHeight: "150px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#dc3545",
                color: "white",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={(!newComment.trim() && !selectedImage) || posting}
          style={{
            marginTop: "8px",
            padding: "8px 16px",
            backgroundColor: posting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: posting ? "not-allowed" : "pointer",
            fontSize: "14px",
            display: "block",
          }}
        >
          {posting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "16px" }}>
          Loading comments...
        </div>
      ) : (
        <div className="comments-list">
          {comments.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
                padding: "16px",
              }}
            >
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  <strong>{comment.nickname}</strong> ·{" "}
                  {new Date(comment.created_at).toLocaleString()}
                </div>
                {comment.content && (
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.4",
                      whiteSpace: "pre-wrap",
                      marginBottom: comment.image ? "8px" : "0",
                    }}
                  >
                    {comment.content}
                  </div>
                )}
                {comment.image && (
                  <div style={{ marginTop: comment.content ? "8px" : "0" }}>
                    <img
                      src={`http://localhost:8080/${comment.image}`}
                      alt="Comment attachment"
                      style={{
                        maxWidth: "300px",
                        maxHeight: "200px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          `http://localhost:8080/${comment.image}`,
                          "_blank"
                        )
                      }
                    />
                  </div>
                )}
                {comment.votes !== 0 && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    {comment.votes} votes
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PostComments;
