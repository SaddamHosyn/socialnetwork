"use client";
import { useState, useRef, useEffect } from "react";
import type { Post } from "../types/types";

type Props = {
  onSubmit?: (newPost?: Post) => void;
  onCancel: () => void;
};

type Follower = {
  id: number;
  nickname: string;
  avatar?: string;
};

type PrivacyType = "public" | "followers" | "private";

const MAX_IMAGES = 5;

const PostCreate: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState<PrivacyType>("public");
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [selectedFollowers, setSelectedFollowers] = useState<number[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files).slice(0, MAX_IMAGES);
    setImages(arr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((img) => formData.append("images", img));
    formData.append("privacy", privacy);

    // Add specific followers for private posts
    if (privacy === "private" && selectedFollowers.length > 0) {
      selectedFollowers.forEach((followerId) =>
        formData.append("specific_followers", followerId.toString())
      );
    }

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
      setImages([]);
      setPrivacy("public");
      setSelectedFollowers([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      const errorText = await res.text();
      console.error("Post creation failed:", res.status, errorText);
      alert(`Failed to create post: ${errorText}`);
    }
  };

  // Fetch followers when privacy is set to "private"
  useEffect(() => {
    if (privacy === "private") {
      fetchFollowers();
    }
  }, [privacy]);

  const fetchFollowers = async () => {
    setLoadingFollowers(true);
    try {
      const response = await fetch("/api/follow/followers", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Debug log
        if (data.success && data.data) {
          console.log("Followers data:", data.data.followers); // Debug log
          setFollowers(data.data.followers || []);
        }
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handlePrivacyChange = (newPrivacy: PrivacyType) => {
    setPrivacy(newPrivacy);
    if (newPrivacy !== "private") {
      setSelectedFollowers([]);
    }
  };

  const handleFollowerToggle = (followerId: number) => {
    setSelectedFollowers((prev) =>
      prev.includes(followerId)
        ? prev.filter((id) => id !== followerId)
        : [...prev, followerId]
    );
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
          <label className="form-label">🔒 Privacy Settings</label>
          <div className="privacy-options">
            <label
              className={`privacy-option ${
                privacy === "public" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={privacy === "public"}
                onChange={(e) =>
                  handlePrivacyChange(e.target.value as PrivacyType)
                }
              />
              <div className="privacy-info">
                <span className="privacy-icon">🌐</span>
                <div className="privacy-text">
                  <strong>Public</strong>
                  <p>Everyone can see this post</p>
                </div>
              </div>
            </label>

            <label
              className={`privacy-option ${
                privacy === "followers" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="privacy"
                value="followers"
                checked={privacy === "followers"}
                onChange={(e) =>
                  handlePrivacyChange(e.target.value as PrivacyType)
                }
              />
              <div className="privacy-info">
                <span className="privacy-icon">👥</span>
                <div className="privacy-text">
                  <strong>All Followers</strong>
                  <p>Only your followers can see this post</p>
                </div>
              </div>
            </label>

            <label
              className={`privacy-option ${
                privacy === "private" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={privacy === "private"}
                onChange={(e) =>
                  handlePrivacyChange(e.target.value as PrivacyType)
                }
              />
              <div className="privacy-info">
                <span className="privacy-icon">🔐</span>
                <div className="privacy-text">
                  <strong>Selected Followers</strong>
                  <p>Choose which followers can see this post</p>
                </div>
              </div>
            </label>
          </div>

          {/* Specific followers selection for private posts */}
          {privacy === "private" && (
            <div className="specific-followers-section">
              <h4>Select Followers:</h4>
              {loadingFollowers ? (
                <div className="loading-followers">Loading followers...</div>
              ) : followers.length > 0 ? (
                <div className="followers-grid">
                  {followers.map((follower) => (
                    <label
                      key={follower.id}
                      className={`follower-option ${
                        selectedFollowers.includes(follower.id)
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFollowers.includes(follower.id)}
                        onChange={() => handleFollowerToggle(follower.id)}
                      />
                      <div className="follower-info">
                        <div className="follower-name">{follower.nickname}</div>
                        <div className="follower-username">
                          @{follower.nickname}
                        </div>
                      </div>
                      {selectedFollowers.includes(follower.id) && (
                        <span className="checkmark">✓</span>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="no-followers">
                  You don't have any followers yet.
                </p>
              )}
              {selectedFollowers.length > 0 && (
                <div className="selected-count">
                  {selectedFollowers.length} follower(s) selected
                </div>
              )}
            </div>
          )}
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
            disabled={!title || !content}
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
