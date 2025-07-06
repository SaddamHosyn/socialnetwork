"use client";
import { useState } from "react";

type Props = { images: string[] };

const PostImages: React.FC<Props> = ({ images }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const imagePath = images[idx].replace(/^\./, ""); // Remove leading dot
  const imageUrl = `http://localhost:8080${imagePath}`;

  return (
    <div>
      <img
        src={imageUrl}
        alt={`post-img-${idx}`}
        style={{ maxWidth: 300, borderRadius: 8 }}
      />
      {images.length > 1 && (
        <div>
          <button
            onClick={() => setIdx((idx - 1 + images.length) % images.length)}
          >
            ←
          </button>
          <button onClick={() => setIdx((idx + 1) % images.length)}>→</button>
        </div>
      )}
    </div>
  );
};
export default PostImages;
