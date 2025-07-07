"use client";
import { useState, useEffect } from "react";
import { useGroups } from "../hooks/useGroups";
import GroupPostCreate from "./GroupPostCreate";
import GroupPostList from "./GroupPostList";
import type { GroupPost } from "../types/groups";

type Props = {
  groupId: number;
};

const GroupPosts: React.FC<Props> = ({ groupId }) => {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Note: You'll need to add these methods to your useGroups hook
  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/groups/posts?group_id=${groupId}`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [groupId]);

  const handlePostCreated = () => {
    setShowCreatePost(false);
    loadPosts(); // Refresh posts
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Group Posts</h2>
        <button
          onClick={() => setShowCreatePost(!showCreatePost)}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          {showCreatePost ? "Cancel" : "Create Post"}
        </button>
      </div>

      {showCreatePost && (
        <div style={{ marginBottom: "2rem" }}>
          <GroupPostCreate
            groupId={groupId}
            onSuccess={handlePostCreated}
            onCancel={() => setShowCreatePost(false)}
          />
        </div>
      )}

      <GroupPostList posts={posts} onPostUpdate={loadPosts} />
    </div>
  );
};

export default GroupPosts;
