import type { Post } from "../types/types";

type Props = {
  post: Post;
  onClick: () => void; // Show single post when clicked
  onVote: (vote: 1 | -1) => void;
};

const PostItem: React.FC<Props> = ({ post, onClick, onVote }) => (
  <div className="post" onClick={onClick} style={{ cursor: "pointer" }}>
    <b>{post.nickname}</b> | {new Date(post.created_at).toLocaleString()}
    <h3>{post.title}</h3>
    <p>{post.content}</p>
    <div>{post.categories.join(", ")}</div>
    <div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onVote(1);
        }}
      >
        ⬆️
      </button>
      <span>{post.votes}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onVote(-1);
        }}
      >
        ⬇️
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation(); /* show single post logic */
        }}
      >
        💬
      </button>
    </div>
  </div>
);

export default PostItem;
