"use client";
import { useState, useEffect } from "react";
import PostCreate from "../PostCreate";
import PostSingle from "../PostSingle";
import PostList from "../PostList";
import CategoryList from "../CategoryList";
import PanelRight from "../PanelRight";
import type { Category, Post } from "../../types/types";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"list" | "create" | "single">(
    "list"
  );
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data || []);
        } else {
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  // Fetch posts
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

  const handlePostSelect = (postId: number) => {
    setSelectedPostId(postId);
    setViewMode("single");
  };

  const handleCreatePost = () => {
    setViewMode("create");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedPostId(null);
  };

  const handlePostCreated = (newPost?: Post) => {
    if (newPost) {
      // Add the new post to the beginning of the posts list
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } else {
      // Fallback: refresh posts if we don't have the new post data
      const currentCat = selectedCategoryId;
      setSelectedCategoryId(null);
      setTimeout(() => setSelectedCategoryId(currentCat), 0);
    }
    setViewMode("list");
  };

  const selectedPost = selectedPostId
    ? posts.find((p) => p.id === selectedPostId) || null
    : null;

  return (
    <div className="posts-page" style={{ display: "flex", gap: "20px" }}>
      <div className="posts-sidebar">
        <h2>Categories</h2>
        <CategoryList
          categories={categories}
          selected={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </div>

      <div className="posts-main" style={{ flex: 1 }}>
        {viewMode === "list" && (
          <>
            <div className="post-bar">
              <button onClick={handleCreatePost}>+ Create Post</button>
            </div>
            <div className="post-feed">
              <PostList
                posts={posts}
                loading={loading}
                onPostSelect={handlePostSelect}
                onVote={handleVote}
              />
            </div>
          </>
        )}

        {viewMode === "create" && (
          <div className="create-post-view">
            <div className="page-header">
              <button onClick={handleBackToList} className="back-button">
                ← Back to Posts
              </button>
              <h2>Create New Post</h2>
            </div>
            <PostCreate
              categories={categories}
              onSubmit={handlePostCreated}
              onCancel={handleBackToList}
            />
          </div>
        )}

        {viewMode === "single" && selectedPost && (
          <div className="single-post-view">
            <div className="page-header">
              <button onClick={handleBackToList} className="back-button">
                ← Back to Posts
              </button>
              <h2>Post Details</h2>
            </div>
            <PostSingle
              post={selectedPost}
              onClose={handleBackToList}
              onVote={handleVote}
            />
          </div>
        )}
      </div>

      {/* Right Panel with Follow System */}
      <div className="posts-right-panel" style={{ width: "300px", flexShrink: 0 }}>
        <PanelRight />
      </div>
    </div>
  );
};

export default PostsPage;
