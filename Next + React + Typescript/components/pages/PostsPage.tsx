"use client";
import { useState, useEffect } from "react";
import PostCreate from "../PostCreate";
import PostSingle from "../PostSingle";
import PostList from "../PostList";
import CategoryList from "../CategoryList";
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
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    setShowCreateForm(true);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedPostId(null);
    setShowCreateForm(false);
  };

  const handlePostCreated = (newPost?: Post) => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
    setShowCreateForm(false);
  };

  return (
    <div className="posts-page-modern">
      <div className="posts-page-layout">
        {/* Sidebar */}
        <aside className="posts-sidebar-modern">
          <div className="sidebar-header">
            <h2>🗂️ Categories</h2>
            <button
              className="create-post-sidebar-btn"
              onClick={handleCreatePost}
            >
              ✨ New Post
            </button>
          </div>

          <div className="categories-section">
            <CategoryList
              categories={categories}
              selected={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
          </div>

          <div className="stats-section">
            <h3>📊 Community Stats</h3>
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-number">{posts.length}</div>
                <div className="stat-label">Posts</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{categories.length}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {posts.reduce((acc, post) => acc + (post.votes || 0), 0)}
                </div>
                <div className="stat-label">Total Votes</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="posts-main-modern">
          {/* Page Header */}
          <div className="posts-main-header">
            <div className="header-content">
              <h1>
                {selectedCategoryId
                  ? `${
                      categories.find((c) => c.id === selectedCategoryId)
                        ?.name || "Category"
                    } Posts`
                  : "🌟 Community Posts"}
              </h1>
              <p>
                {selectedCategoryId
                  ? "Discover amazing posts in this category"
                  : "Share your thoughts and connect with the community"}
              </p>
            </div>
            <button className="primary-action-btn" onClick={handleCreatePost}>
              <span>✨</span>
              Create Post
            </button>
          </div>

          {/* Create Post Form (Inline) */}
          {showCreateForm && (
            <div className="create-post-inline">
              <div className="create-post-header-inline">
                <h2>✍️ Share Your Thoughts</h2>
                <button
                  className="close-create-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  ✕
                </button>
              </div>
              <PostCreate
                categories={categories}
                onSubmit={handlePostCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          {/* Single Post View */}
          {viewMode === "single" && selectedPostId && (
            <div className="single-post-view">
              <button className="back-to-posts-btn" onClick={handleBackToList}>
                ← Back to Posts
              </button>
              <PostSingle postId={selectedPostId} />
            </div>
          )}

          {/* Posts List */}
          {viewMode === "list" && (
            <div className="posts-content-area">
              {loading ? (
                <div className="posts-loading-modern">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                  <p>Loading amazing posts...</p>
                </div>
              ) : posts.length > 0 ? (
                <div className="posts-grid-modern">
                  <PostList
                    posts={posts}
                    loading={loading}
                    onPostSelect={handlePostSelect}
                    onVote={handleVote}
                  />
                </div>
              ) : (
                <div className="no-posts-modern">
                  <div className="no-posts-icon">📝</div>
                  <h3>No posts yet</h3>
                  <p>
                    {selectedCategoryId
                      ? "No posts found in this category. Be the first to share!"
                      : "Be the first to share something amazing with the community!"}
                  </p>
                  <button
                    className="create-first-post-btn"
                    onClick={handleCreatePost}
                  >
                    Create First Post
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PostsPage;
