"use client";
import { useState, useEffect } from "react";
import CommentContent from "./CommentContent";
import type { Comment } from "../types/types";

type Props = {
  postId: number;
  pageSize?: number; // Optional, default to 50
};

const CommentList = ({ postId, pageSize = 50 }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Voting logic for comments
  const handleVote = async (commentId: number, vote: 1 | -1) => {
    const res = await fetch("/api/comment/vote", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        comment_id: commentId.toString(),
        vote: vote.toString(),
      }),
    });
    if (res.ok) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, votes: c.votes + vote } : c
        )
      );
    }
  };

  // Load comments for the current page
  const fetchComments = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/comment/fetch?post_id=${postId}&limit=${pageSize}&offset=${offset}`,
      { credentials: "include" }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [...prev, ...data.data]);
        setHasMore(data.data.length === pageSize);
        setOffset((prev) => prev + data.data.length);
      }
    }
    setLoading(false);
  };

  // Initial load and reset when postId changes
  useEffect(() => {
    setComments([]);
    setOffset(0);
    setHasMore(true);
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  return (
    <div>
      <ul>
        {comments.map((c) => (
          <li key={c.id} style={{ marginBottom: 16 }}>
            <CommentContent comment={c} onVote={(v) => handleVote(c.id, v)} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <button onClick={fetchComments} disabled={loading}>
          {loading ? "Loading…" : "Load more comments"}
        </button>
      )}
      {!comments.length && !loading && <div>No comments yet.</div>}
    </div>
  );
};

export default CommentList;
