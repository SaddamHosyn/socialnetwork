// PostContent.tsx
import React from "react";
import PostImages from "./PostImages.tsx";
import type { Post } from "../types";

type Props = {
  post: Post;
  onVote?: (vote: 1 | -1) => void;
};

const PostContent: React.FC<Props> = ({ post, onVote }) => (
  <div>
    <b>{post.nickname}</b> | {new Date(post.created_at).toLocaleString()}
    <h3>{post.title}</h3>
    <p>{post.content}</p>
    <PostImages images={post.image_paths || []} />
    <div>
      <button onClick={() => onVote?.(1)}>⬆️</button>
      <span>{post.votes}</span>
      <button onClick={() => onVote?.(-1)}>⬇️</button>
    </div>
  </div>
);

export default PostContent;
