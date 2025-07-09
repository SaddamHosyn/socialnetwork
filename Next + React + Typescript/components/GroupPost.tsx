"use client";
import { useState } from "react";
import GroupPostCreate from "./GroupPostCreate";
import GroupPostList from "./GroupPostList";

type Props = {
  groupId: number;
};

const GroupPosts: React.FC<Props> = ({ groupId }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handlePostCreated = () => {
    setShowCreatePost(false);
  };

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

      <GroupPostList groupId={groupId} isGroupMember={true} />
    </div>
  );
};

export default GroupPosts;
