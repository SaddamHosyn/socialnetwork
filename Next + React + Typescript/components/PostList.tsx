import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import PostComments from "./PostComments";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { Post } from "../types/types";

type Props = {
  posts?: Post[];
  loading?: boolean;
  categoryId?: number | null;
  onPostSelect?: (postId: number) => void;
  onVote?: (postId: number, vote: 1 | -1) => void;
};

const PostList = ({
  posts: propPosts,
  loading: propLoading,
  categoryId,
  onVote,
}: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );
  const { user: currentUser } = useCurrentUser();

  // Use props if provided, otherwise fetch data
  const finalPosts = propPosts || posts;
  const finalLoading = propLoading !== undefined ? propLoading : loading;

  useEffect(() => {
    // Only fetch if posts aren't provided via props
    if (propPosts === undefined) {
      setLoading(true);
      let url = "/api/posts";
      if (categoryId !== null && categoryId !== undefined) {
        url += `?category_id=${categoryId}`;
      }

      fetch(url, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPosts(data.data || []);
          } else {
            setPosts([]);
          }
        })
        .catch(() => setPosts([]))
        .finally(() => setLoading(false));
    }
  }, [categoryId, propPosts]);

  const handleVote = async (postId: number, vote: 1 | -1) => {
    if (onVote) {
      onVote(postId, vote);
      return;
    }

    // Default vote handling if no onVote prop
    const res = await fetch("/api/vote", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        post_id: postId.toString(),
        vote: vote.toString(),
      }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  votes: result.data.new_vote_total,
                  userVote: result.data.user_vote,
                }
              : p
          )
        );
      }
    }
  };

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (finalLoading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (finalPosts.length === 0) {
    return <div className="no-posts">No posts found.</div>;
  }

  return (
    <div className="post-list">
      {finalPosts.map((post) => (
        <div key={post.id} className="post-with-comments">
          <PostContent
            post={post}
            currentUserId={currentUser?.id}
            onCommentClick={() => toggleComments(post.id)}
            onVote={(vote) => handleVote(post.id, vote)}
          />
          <PostComments
            postId={post.id}
            isVisible={expandedComments.has(post.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default PostList;
