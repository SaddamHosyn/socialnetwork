import React, { useEffect, useState } from "react";
import PostContent from "./PostContent";
import type { Post } from "../types";

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
    if (categoryId) {
      url += `?category_id=${categoryId}`;
    }
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

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
          <PostContent post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
