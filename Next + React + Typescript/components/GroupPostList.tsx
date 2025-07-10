"use client";
import { useState, useEffect } from "react";
import { GroupPost, GroupComment } from "../types/groups";
import PostImages from "./PostImages";

interface Props {
  groupId: number;
  isGroupMember: boolean;
}

const GroupPostList: React.FC<Props> = ({ groupId, isGroupMember }) => {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<{ [postId: number]: GroupComment[] }>({});
  const [newComments, setNewComments] = useState<{ [postId: number]: string }>({});
  const [commentImages, setCommentImages] = useState<{ [postId: number]: File | null }>({});
  const [commentLoading, setCommentLoading] = useState<{ [postId: number]: boolean }>({});

  // Debug logging
  console.log("GroupPostList - groupId:", groupId, "isGroupMember:", isGroupMember);

  // Load group posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/groups/posts?group_id=${groupId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setPosts(data.data || []);
        } else {
          setError(data.error || "Failed to load posts");
        }
      } catch (err) {
        console.error("Error loading posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchPosts();
    }
  }, [groupId]);

  // Load comments for a specific post
  const loadComments = async (postId: number) => {
    try {
      const response = await fetch(`/api/groups/posts/comments?post_id=${postId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setComments(prev => ({
            ...prev,
            [postId]: data.data || []
          }));
        }
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  // Toggle comment section visibility
  const toggleComments = async (postId: number) => {
    const newExpanded = new Set(expandedComments);
    
    if (expandedComments.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Load comments if not already loaded
      if (!comments[postId]) {
        await loadComments(postId);
      }
    }
    
    setExpandedComments(newExpanded);
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId: number, e: React.FormEvent) => {
    e.preventDefault();
    
    const content = newComments[postId]?.trim();
    if (!content) return;

    setCommentLoading(prev => ({ ...prev, [postId]: true }));

    try {
      const formData = new FormData();
      formData.append("post_id", postId.toString());
      formData.append("content", content);
      
      const image = commentImages[postId];
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/api/groups/posts/comments/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Add new comment to the list
          setComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), data.data]
          }));
          
          // Clear form
          setNewComments(prev => ({ ...prev, [postId]: "" }));
          setCommentImages(prev => ({ ...prev, [postId]: null }));
          
          // Update post comment count
          setPosts(prev => prev.map(post => 
            post.id === postId 
              ? { ...post, comments_count: post.comments_count + 1 }
              : post
          ));
        }
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle comment text change
  const handleCommentChange = (postId: number, value: string) => {
    setNewComments(prev => ({ ...prev, [postId]: value }));
  };

  // Handle comment image selection
  const handleCommentImageChange = (postId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCommentImages(prev => ({ ...prev, [postId]: e.target.files![0] }));
    }
  };

  // Remove comment image
  const removeCommentImage = (postId: number) => {
    setCommentImages(prev => ({ ...prev, [postId]: null }));
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (posts.length === 0) {
    return <div className="no-posts">No posts in this group yet.</div>;
  }

  return (
    <div className="group-posts">
      {posts.map((post) => (
        <div key={post.id} className="post-card" style={{ marginBottom: "1rem" }}>
          {/* Post Header */}
          <div style={{ fontSize: 12, color: "#888", marginBottom: "0.5rem" }}>
            <span>{post.nickname} · {new Date(post.created_at).toLocaleString()}</span>
          </div>

          {/* Post Content */}
          <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: "0.5rem" }}>
            {post.title}
          </div>
          <div style={{ fontSize: 16, marginBottom: "0.5rem" }}>
            {post.content}
          </div>

          {/* Post Images */}
          {post.image_paths && post.image_paths.length > 0 && (
            <PostImages images={post.image_paths} />
          )}

          {/* Post Actions */}
          <div style={{ marginTop: "1rem", paddingTop: "0.5rem", borderTop: "1px solid #eee" }}>
            <span style={{ marginRight: "1rem", color: "#666" }}>
              {post.votes} votes
            </span>
            
            {/* Debug info */}
            <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
              DEBUG: isGroupMember = {isGroupMember ? "true" : "false"}
            </div>
            
            {isGroupMember && (
              <button
                onClick={() => toggleComments(post.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                💬 {expandedComments.has(post.id) ? "Hide" : "Show"} Comments ({post.comments_count})
              </button>
            )}
            
            {/* Always visible test button */}
            <button
              onClick={() => toggleComments(post.id)}
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
                marginLeft: "8px"
              }}
            >
              💬 TEST Comments ({post.comments_count})
            </button>
          </div>

          {/* Comments Section */}
          {expandedComments.has(post.id) && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
              {/* Comment Form */}
              <form onSubmit={(e) => handleCommentSubmit(post.id, e)} style={{ marginBottom: "1rem" }}>
                <textarea
                  value={newComments[post.id] || ""}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    resize: "vertical"
                  }}
                  disabled={commentLoading[post.id]}
                />
                
                {/* Image Upload */}
                <div style={{ marginTop: "8px" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCommentImageChange(post.id, e)}
                    disabled={commentLoading[post.id]}
                    style={{ display: "none" }}
                    id={`comment-image-${post.id}`}
                  />
                  <label
                    htmlFor={`comment-image-${post.id}`}
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      marginRight: "8px"
                    }}
                  >
                    📷 Add Image
                  </label>
                  
                  {commentImages[post.id] && (
                    <div style={{
                      marginTop: "8px",
                      padding: "8px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ fontSize: "0.8rem" }}>
                        {commentImages[post.id]!.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCommentImage(post.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc3545",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={commentLoading[post.id] || !newComments[post.id]?.trim()}
                  style={{
                    marginTop: "8px",
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    opacity: (commentLoading[post.id] || !newComments[post.id]?.trim()) ? 0.6 : 1
                  }}
                >
                  {commentLoading[post.id] ? "Posting..." : "Post Comment"}
                </button>
              </form>

              {/* Comments List */}
              <div style={{ display: "grid", gap: "1rem" }}>
                {comments[post.id]?.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem"
                    }}>
                      <strong>{comment.nickname}</strong>
                      <span style={{ color: "#666", fontSize: "0.8rem" }}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      {comment.content}
                    </div>
                    {comment.image && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <img
                          src={comment.image}
                          alt="Comment"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "4px",
                            border: "1px solid #ddd"
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                {comments[post.id]?.length === 0 && (
                  <div style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupPostList;
