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
          onCancel={() => setShowPostCreate(false)}
        />
      </Modal>

      <Modal
        open={!!showPostSingle}
        onClose={() => setShowPostSingle(null)}
        containerId="single-post-container"
      >
        {showPostSingle && (
          <PostSingle
            postId={showPostSingle}
            onClose={() => setShowPostSingle(null)}
          />
        )}
      </Modal>

      <div id="post-feed">
        <PostList
          categoryId={selectedCategoryId}
          onPostSelect={setShowPostSingle}
        />
      </div>
    </section>
  );
};

export default PanelMiddle;
