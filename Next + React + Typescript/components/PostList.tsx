import { useState, useEffect } from "react";
import PostContent from "./PostContent";
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
  onPostSelect,
  onVote,
}: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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
<<<<<<< HEAD
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (p.userVote === vote) return p;
        return p;
      })
    );
=======
    if (onVote) {
      onVote(postId, vote);
      return;
    }

    // Default vote handling if no onVote prop
>>>>>>> origin/milli
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
<<<<<<< HEAD
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          let newVotes = p.votes;
          if (p.userVote === 1 && vote === -1) newVotes -= 2;
          else if (p.userVote === -1 && vote === 1) newVotes += 2;
          else if (p.userVote === 0 || p.userVote === undefined)
            newVotes += vote;
          return { ...p, votes: newVotes, userVote: vote };
        })
      );
=======
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
>>>>>>> origin/milli
    }
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
        <PostContent
          key={post.id}
          post={post}
          onCommentClick={
            onPostSelect ? () => onPostSelect(post.id) : undefined
          }
          onVote={(vote) => handleVote(post.id, vote)}
        />
      ))}
    </div>
  );
};

export default PostList;
