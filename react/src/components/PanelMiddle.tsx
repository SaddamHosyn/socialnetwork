import Modal from "./Modal";
import { useEffect, useState } from "react";
import PostCreate from "./PostCreate";
import PostSingle from "./PostSingle";
import PostList from "./PostList";
import type { Category } from "../types";

type Props = {
  selectedCategoryId: number | null;
};

const PanelMiddle: React.FC<Props> = ({ selectedCategoryId }) => {
  const [showPostSingle, setShowPostSingle] = useState<null | number>(null);
  const [showPostCreate, setShowPostCreate] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });
  }, []);

  return (
    <main style={{ flex: 1, padding: "0 32px" }}>
      <button
        style={{ position: "sticky", top: 0, marginBottom: 16 }}
        onClick={() => setShowPostCreate(true)}
      >
        + Create Post
      </button>

      {/* Post creation modal */}
      <Modal open={showPostCreate} onClose={() => setShowPostCreate(false)}>
        <PostCreate
          categories={categories}
          onCancel={() => setShowPostCreate(false)}
        />
      </Modal>

      {/* Post single modal */}
      <Modal open={!!showPostSingle} onClose={() => setShowPostSingle(null)}>
        {showPostSingle && (
          <PostSingle
            postId={showPostSingle}
            onClose={() => setShowPostSingle(null)}
          />
        )}
      </Modal>

      {/* Post feed */}
      <PostList
        categoryId={selectedCategoryId}
        onPostSelect={setShowPostSingle}
      />
    </main>
  );
};

export default PanelMiddle;
