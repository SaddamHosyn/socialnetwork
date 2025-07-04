import PostImages from "./PostImages";
import type { Post } from "../types/types";
import Vote from "./Vote";

type Props = {
  post: Post;
  onCommentClick?: () => void;
  onVote?: (v: 1 | -1) => void;
};

const PostContent = ({ post, onCommentClick, onVote }: Props) => (
  <div className="post-card">
    <div style={{ fontSize: 12, color: "#888" }}>
      {post.group && <span>[{post.group}] </span>}
      <span>
        {post.nickname} · {new Date(post.created_at).toLocaleString()}
      </span>
    </div>
    <div style={{ fontSize: 22, fontWeight: "bold" }}>{post.title}</div>
    <div style={{ fontSize: 16, margin: "8px 0" }}>{post.content}</div>
    {post.image_paths && post.image_paths.length > 0 && (
      <PostImages images={post.image_paths} />
    )}
    <div style={{ margin: "8px 0" }}>
      {post.categories.map((cat) => (
        <span
          key={cat}
          style={{
            display: "inline-block",
            background: "#e3e8f0",
            borderRadius: 12,
            padding: "2px 10px",
            marginRight: 6,
            fontSize: 13,
          }}
        >
          {cat}
        </span>
      ))}
    </div>
    <div style={{ marginTop: 8 }}>
      {onVote ? (
        <Vote votes={post.votes} onVote={onVote} />
      ) : (
        <span style={{ marginRight: 8, fontWeight: 600 }}>
          {post.votes} votes
        </span>
      )}
      {onCommentClick && (
        <button onClick={onCommentClick} style={{ marginLeft: 8 }}>
          💬 {post.comments_count ?? ""}
        </button>
      )}
    </div>
  </div>
);

export default PostContent;
