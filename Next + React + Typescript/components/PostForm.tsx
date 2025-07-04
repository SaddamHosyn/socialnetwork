import React, { useState, useEffect } from "react";
import { Category } from "../types";

type Props = {
  categories: Category[]; // fetched in parent, passed as prop
  onSubmit: (form: {
    title: string;
    content: string;
    categoryIds: number[];
  }) => void;
  onCancel: () => void;
};

const PostForm: React.FC<Props> = ({ categories, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const handleCategory = (id: number) => {
    setSelected((old) =>
      old.includes(id)
        ? old.filter((x) => x !== id)
        : old.length < 3
        ? [...old, id]
        : old
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || selected.length === 0) return;
    onSubmit({ title, content, categoryIds: selected });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        required
      />
      <div>
        <b>Select up to 3 categories:</b>
        {categories.map((cat) => (
          <label key={cat.id} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={selected.includes(cat.id)}
              onChange={() => handleCategory(cat.id)}
              disabled={!selected.includes(cat.id) && selected.length >= 3}
            />
            {cat.name}
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={!title || !content || selected.length === 0}
      >
        Post
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default PostForm;
