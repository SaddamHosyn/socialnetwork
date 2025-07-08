import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import type { Post, Comment } from "../types/types";

type Props = {
  post?: Post;
  postId?: number;
  onClose?: () => void;
  onVote?: (postId: number, vote: 1 | -1) => void;
};

const PostSingle = ({ post: propPost, postId, onClose, onVote }: Props) => {
  const [post, setPost] = useState<Post | null>(propPost || null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(!propPost);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const finalPostId = post?.id || postId;

  useEffect(() => {
    if (!propPost && postId) {
      setLoading(true);
      fetch(`/api/post/${postId}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPost(data.data);
          }
        })
        .catch((error) => console.error("Error fetching post:", error))
        .finally(() => setLoading(false));
    }
  }, [propPost, postId]);

  useEffect(() => {
    if (finalPostId) {
      fetch(`/api/post/${finalPostId}/comments`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setComments(data.data || []);
          }
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  }, [finalPostId]);

  const handleVote = async (vote: 1 | -1) => {
    if (!finalPostId) return;

    if (onVote) {
      onVote(finalPostId, vote);
      return;
    }

    // Default vote handling
    const res = await fetch("/api/vote", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        post_id: finalPostId.toString(),
        vote: vote.toString(),
      }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && post) {
        setPost({
          ...post,
          votes: result.data.new_vote_total,
          userVote: result.data.user_vote,
        });
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !finalPostId) return;

    setCommentLoading(true);
    const res = await fetch("/api/comment", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        post_id: finalPostId.toString(),
        content: newComment.trim(),
      }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        setComments([...comments, result.data]);
        setNewComment("");
      }
    }
    setCommentLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="error">Post not found.</div>;
  }

  return (
    <div className="post-single">
      <PostContent post={post} onVote={handleVote} />

      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            disabled={commentLoading}
          />
          <button type="submit" disabled={!newComment.trim() || commentLoading}>
            {commentLoading ? "Posting..." : "Post Comment"}
          </button>
        </form>

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.nickname}</strong>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostSingle;
