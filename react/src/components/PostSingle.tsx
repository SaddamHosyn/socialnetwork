// PostSingle.tsx
import React from "react";
import PostContent from "./PostContent";

const PostSingle: React.FC<{ post: Post; isOwner: boolean }> = ({
  post,
  isOwner,
}) => {
  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    // call delete API
    const res = await fetch("/api/post/delete", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ post_id: post.id }),
      headers: { "Content-Type": "application/json" },
    });
    // handle result: show toast, redirect, etc
  };

  return (
    <div>
      <PostContent post={post} />
      {isOwner && (
        <button onClick={handleDelete} style={{ color: "red" }}>
          Delete
        </button>
      )}
      {/* Comments, CommentForm, etc */}
    </div>
  );
};

export default PostSingle;
