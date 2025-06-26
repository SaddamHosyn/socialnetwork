import React, { useEffect, useState } from "react";
import PostContent from "./PostContent";
import CommentList from "./CommentList";
import CommentCreate from "./CommentCreate";
import type { Post } from "../types";

type Props = {
  postId: number;
  onClose: () => void;
};

const PostSingle: React.FC<Props> = ({ postId, onClose }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/post?id=${postId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((postRes) => {
        if (postRes.success) setPost(postRes.data.post);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <button onClick={onClose}>Back</button>
      <PostContent post={post} />
      <h3>Comments</h3>
      <CommentList postId={post.id} />
      <CommentCreate postId={post.id} onCommentAdded={() => {}} />
    </div>
  );
};

export default PostSingle;
