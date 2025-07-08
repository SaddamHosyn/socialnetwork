"use client";
import { useState } from "react";
import Modal from "./Modal";
import PostCreate from "./PostCreate";
import PostSingle from "./PostSingle";
import PostList from "./PostList";
import type { Category } from "../types/types";
import { ref } from "process";

type Props = {
  selectedCategoryId: number | null;
  categories: Category[];
};

const PanelMiddle = ({ selectedCategoryId, categories }: Props) => {
  const [showPostSingle, setShowPostSingle] = useState<null | number>(null);
  const [showPostCreate, setShowPostCreate] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(0);

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
            setRefreshFeed((k) => k + 1);
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
        {showPostSingle && (
          <PostSingle
            postId={showPostSingle}
            onClose={() => setShowPostSingle(null)}
          />
        )}
      </Modal>
      <div id="post-feed">
        <PostList
          key={refreshFeed}
          categoryId={selectedCategoryId}
          onPostSelect={setShowPostSingle}
        />
      </div>
    </section>
  );
};

export default PanelMiddle;
