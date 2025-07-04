import React, { useState } from "react";

type Props = { images: string[] };

const PostImages: React.FC<Props> = ({ images }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div>
      <img
        src={images[idx]}
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
