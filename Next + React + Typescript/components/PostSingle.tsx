"use client";
import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import CommentList from "./CommentList";
import CommentCreate from "./CommentCreate";
import type { Post } from "../types/types";

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

  // Add vote handler for single post view
  const handlePostVote = async (vote: 1 | -1) => {
    if (!post) return;
    const res = await fetch("/api/post/vote", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        post_id: post.id.toString(),
        vote: vote.toString(),
      }),
    });
    if (res.ok) {
      setPost((prev) => (prev ? { ...prev, votes: prev.votes + vote } : prev));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <button onClick={onClose}>Back</button>
      <PostContent post={post} onVote={handlePostVote} />
      <h3>Comments</h3>
      <CommentList postId={post.id} />
      <CommentCreate postId={post.id} onCommentAdded={() => {}} />
    </div>
  );
};

export default PostSingle;
