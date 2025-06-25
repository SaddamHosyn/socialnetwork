import React, { useState } from "react";
import PostList from "./PostList";
import PostCreate from "./PostCreate";
import PostSingle from "./PostSingle";
import type { Post } from "../types";

type Props = {
  selectedCategoryId: number | null;
  // You can add user info or other props if needed
};

const PanelMiddle: React.FC<Props> = ({ selectedCategoryId }) => {
  const [showPostSingle, setShowPostSingle] = useState<null | number>(null);

  // Optional: show/hide post creation, e.g. via modal
  // const [showCreate, setShowCreate] = useState(false);

  return (
    <main style={{ flex: 1, padding: "0 32px" }}>
      {/* Post creation form */}
      <PostCreate /* categories, onSuccess, etc */ />

      {/* If a single post is selected, show it (modal or page replacement) */}
      {showPostSingle ? (
        <PostSingle
          postId={showPostSingle}
          onClose={() => setShowPostSingle(null)}
        />
      ) : (
        <PostList
          categoryId={selectedCategoryId}
          onPostSelect={(postId: number) => setShowPostSingle(postId)}
        />
      )}
    </main>
  );
};

export default PanelMiddle;
