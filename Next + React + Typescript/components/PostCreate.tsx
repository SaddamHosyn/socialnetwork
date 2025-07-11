"use client";
import { useState, useRef } from "react";
import type { Category, Post } from "../types/types";

type Props = {
  categories: Category[];
  onSubmit?: (newPost?: Post) => void;
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
    <div className="post-create-modern">
      <form
        className="post-create-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form-section">
          <label className="form-label">📝 Post Title</label>
          <input
            type="text"
            name="title"
            placeholder="What's your post about?"
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input-modern"
            required
          />
          <div className="char-count">{title.length}/100</div>
        </div>

        <div className="form-section">
          <label className="form-label">✍️ Content</label>
          <textarea
            name="content"
            placeholder="Share your thoughts, ideas, or experiences..."
            value={content}
            maxLength={2000}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea-modern"
            rows={6}
            required
          />
          <div className="char-count">{content.length}/2000</div>
        </div>

        <div className="form-section">
          <label className="form-label">🏷️ Categories (select up to 3)</label>
          <div className="categories-grid">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`category-option ${
                  selectedCats.includes(cat.id) ? "selected" : ""
                } ${
                  !selectedCats.includes(cat.id) && selectedCats.length >= 3
                    ? "disabled"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat.id)}
                  onChange={() => handleCategory(cat.id)}
                  disabled={
                    !selectedCats.includes(cat.id) && selectedCats.length >= 3
                  }
                  className="category-checkbox"
                />
                <span className="category-name">{cat.name}</span>
                {selectedCats.includes(cat.id) && (
                  <span className="checkmark">✓</span>
                )}
              </label>
            ))}
          </div>
          <div className="selection-count">
            {selectedCats.length}/3 categories selected
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">
            📸 Images (optional, max {MAX_IMAGES})
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImages}
              className="file-input-hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="file-input-label">
              <span className="upload-icon">📁</span>
              Choose Images
            </label>
          </div>

          {images.length > 0 && (
            <div className="selected-images">
              <h4>Selected Images:</h4>
              <div className="image-list">
                {images.map((img, idx) => (
                  <div key={img.name + idx} className="image-item">
                    <span className="image-name">
                      📷 {img.name}
                      {idx === 0 && <span className="cover-badge">Cover</span>}
                    </span>
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        const newImages = images.filter((_, i) => i !== idx);
                        setImages(newImages);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="image-count">
                {images.length}/{MAX_IMAGES} images
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={!title || !content || selectedCats.length === 0}
            className="submit-btn-modern"
          >
            <span>🚀</span>
            Publish Post
          </button>
          <button
            type="button"
            className="cancel-btn-modern"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
