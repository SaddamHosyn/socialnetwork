import React, { useEffect, useState } from "react";
import CommentContent from "./CommentContent";
import type { Comment } from "../types";

type Props = {
  postId: number;
  pageSize?: number; // Optional, default to 50
};

const CommentList: React.FC<Props> = ({ postId, pageSize = 50 }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
            <CommentContent
              comment={c}
              onVote={(v) => {
                /* vote logic */
              }}
            />
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
