import React, { useEffect, useState } from "react";
import PostSingle from "./PostSingle";
import type { Post } from "../types";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (posts.length === 0) return <div>No posts yet.</div>;

  return (
    <div>
      {posts.map((post) => (
        <PostSingle key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
