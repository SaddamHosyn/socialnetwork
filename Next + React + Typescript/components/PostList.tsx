"use client";
import { useEffect, useState } from "react";
import PostContent from "./PostContent";
import type { Post } from "../types/types";

type Props = {
  categoryId: number | null;
  onPostSelect: (postId: number) => void;
};

const PostList: React.FC<Props> = ({ categoryId, onPostSelect }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = "/api/posts";
    if (categoryId !== null) url += `?category_id=${categoryId}`;
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  // --- POST VOTING LOGIC ---
  const handleVote = async (postId: number, vote: 1 | -1) => {
    const res = await fetch("/api/post/vote", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        post_id: postId.toString(),
        vote: vote.toString(),
      }),
    });
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, votes: p.votes + vote } : p))
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (posts.length === 0) return <div>No posts yet.</div>;

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{ marginBottom: 32, cursor: "pointer" }}
          onClick={() => onPostSelect(post.id)}
        >
          <PostContent post={post} onVote={(v) => handleVote(post.id, v)} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
