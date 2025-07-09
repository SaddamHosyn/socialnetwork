"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import PostCreate from "./PostCreate";
import PostSingle from "./PostSingle";
import PostList from "./PostList";
import type { Category, Post } from "../types/types";

type Props = {
  selectedCategoryId: number | null;
  categories: Category[];
  // Add the setter function to the props
  setSelectedCategoryId: (id: number | null) => void;
};

const PanelMiddle: React.FC<Props> = ({
  selectedCategoryId,
  categories,
  setSelectedCategoryId, // Destructure the new prop
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostSingle, setShowPostSingle] = useState<null | number>(null);
  const [showPostCreate, setShowPostCreate] = useState(false);

  // Fetch posts whenever the selected category changes
  useEffect(() => {
    setLoading(true);
    let url = "/api/posts";
    if (selectedCategoryId !== null) {
      url += `?category_id=${selectedCategoryId}`;
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
      .finally(() => setLoading(false));
  }, [selectedCategoryId]);

  // --- MASTER VOTE HANDLER ---
  const handleVote = async (postId: number, vote: 1 | -1) => {
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
    } else {
      console.error("Failed to vote");
    }
  };

  const selectedPost = posts.find((p) => p.id === showPostSingle) || null;

  return (
    <section id="middle-panel">
      <div id="post-bar">
        <button onClick={() => setShowPostCreate(true)}>+ Create Post</button>
      </div>
      <Modal
        open={showPostCreate}
        onClose={() => setShowPostCreate(false)}
        containerId="create-post-container"
      >
        <PostCreate
          categories={categories}
          onSubmit={() => {
            // Refetch posts after creation by resetting the category ID momentarily
            // This is a simple way to trigger the useEffect to refetch
            const currentCat = selectedCategoryId;
            setSelectedCategoryId(null);
            setTimeout(() => setSelectedCategoryId(currentCat), 0);
            setShowPostCreate(false);
          }}
          onCancel={() => setShowPostCreate(false)}
        />
      </Modal>
      <Modal
        open={!!showPostSingle}
        onClose={() => setShowPostSingle(null)}
        containerId="single-post-container"
      >
        <PostSingle
          post={selectedPost}
          onClose={() => setShowPostSingle(null)}
          onVote={handleVote}
        />
      </Modal>
      <div id="post-feed">
        <PostList
          posts={posts}
          loading={loading}
          onPostSelect={setShowPostSingle}
          onVote={handleVote}
        />
      </div>
    </section>
  );
};

export default PanelMiddle;
