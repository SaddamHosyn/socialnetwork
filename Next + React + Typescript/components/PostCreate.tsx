"use client";
import { useState, useRef } from "react";
import type { Category } from "../types/types";

type Props = {
  categories: Category[];
  onSubmit?: (newPost?: any) => void;
  onCancel: () => void;
};

const MAX_IMAGES = 5;

const PostCreate: React.FC<Props> = ({ categories, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCategory = (id: number) => {
    setSelectedCats((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files).slice(0, MAX_IMAGES);
    setImages(arr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || selectedCats.length === 0) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    selectedCats.forEach((cat) => formData.append("category", cat.toString()));
    images.forEach((img) => formData.append("images", img));

    const res = await fetch("/api/post/create", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data.post) {
        onSubmit?.(result.data.post);
      } else {
        onSubmit?.();
      }
      onCancel();
      setTitle("");
      setContent("");
      setSelectedCats([]);
      setImages([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    // handle error...
  };

  return (
    <form
      id="create-post-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={title}
        maxLength={100}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        name="content"
        placeholder="Content"
        value={content}
        maxLength={2000}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div>
        <b>Categories (pick up to 3):</b>
        {categories.map((cat) => (
          <label key={cat.id} style={{ marginRight: 8 }}>
            <input
              type="checkbox"
              checked={selectedCats.includes(cat.id)}
              onChange={() => handleCategory(cat.id)}
              disabled={
                !selectedCats.includes(cat.id) && selectedCats.length >= 3
              }
            />
            {cat.name}
          </label>
        ))}
      </div>
      <div>
        <b>Images (optional, max {MAX_IMAGES}):</b>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          onChange={handleImages}
        />
        {images.length > 0 && (
          <ul>
            {images.map((img, idx) => (
              <li key={img.name + idx}>
                {img.name} {idx === 0 && <strong>(cover)</strong>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="button-group">
        <button
          type="submit"
          disabled={!title || !content || selectedCats.length === 0}
        >
          Post
        </button>
        <button type="button" id="cancel-create-post" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PostCreate;
