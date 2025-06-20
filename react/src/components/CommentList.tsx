import React from "react";
import type { Comment } from "../types";

type Props = { comments: Comment[] };

const CommentList: React.FC<Props> = ({ comments }) => (
  <ul>
    {comments.map((c) => (
      <li key={c.id}>
        <b>{c.nickname}</b>: {c.content}
        <div style={{ fontSize: "0.8em", color: "#888" }}>
          {new Date(c.created_at).toLocaleString()}
        </div>
      </li>
    ))}
  </ul>
);

export default CommentList;
