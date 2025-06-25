import React, { useEffect, useState } from "react";
import PostContent from "./PostContent";
import type { Post } from "../types";
import PostSingle from "./PostSingle"; // If you use single post view

type Props = {
  categoryId: number | null;
};

const PostList: React.FC<Props> = ({ categoryId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [singlePost, setSinglePost] = useState<Post | null>(null);

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

  if (singlePost) {
    return (
      <PostSingle postId={singlePost.id} onClose={() => setSinglePost(null)} />
    );
  }

  if (loading) return <div>Loading...</div>;
  if (posts.length === 0) return <div>No posts yet.</div>;

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: 32 }}>
          <PostContent post={post} onCommentClick={() => setSinglePost(post)} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
