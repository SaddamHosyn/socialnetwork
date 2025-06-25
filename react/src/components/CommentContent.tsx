// CommentContent.tsx
import React from "react";
import type { Comment } from "../types";

type Props = {
  comment: Comment;
  onVote?: (vote: 1 | -1) => void;
};

const CommentContent: React.FC<Props> = ({ comment, onVote }) => (
  <div style={{ borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
    <div style={{ fontSize: 13, color: "#555" }}>
      <b>{comment.nickname}</b> ·{" "}
      <span style={{ color: "#999" }}>
        {new Date(comment.created_at).toLocaleString()}
      </span>
    </div>
    <div style={{ margin: "4px 0 8px 0", fontSize: 15 }}>{comment.content}</div>
    <div>
      <button onClick={() => onVote?.(1)}>⬆️</button>
      <span style={{ margin: "0 8px" }}>{comment.votes}</span>
      <button onClick={() => onVote?.(-1)}>⬇️</button>
    </div>
  </div>
);

export default CommentContent;
