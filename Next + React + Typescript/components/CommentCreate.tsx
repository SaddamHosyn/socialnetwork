"use client";
import { useState } from "react";

type Props = {
  postId: number;
  onCommentAdded?: () => void;
  onCancel?: () => void; // optional
};

const CommentCreate = ({ postId, onCommentAdded, onCancel }: Props) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    const res = await fetch("/api/comment/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        post_id: postId.toString(),
        content: content.trim(),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setContent("");
      onCommentAdded?.();
    } else {
      // handle error
    }
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Write your comment…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        maxLength={1000}
        disabled={loading}
      />
      <button type="submit" disabled={!content.trim() || loading}>
        {loading ? "Posting…" : "Post"}
      </button>
      <button type="button" onClick={handleCancel} disabled={loading}>
        Cancel
      </button>
    </form>
  );
};

export default CommentCreate;
