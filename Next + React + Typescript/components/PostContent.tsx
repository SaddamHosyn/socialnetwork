import PostImages from "./PostImages";
import type { Post } from "../types/types";
import Vote from "./Vote";

type Props = {
  post: Post;
  onCommentClick?: () => void;
  onVote?: (v: 1 | -1) => void;
  currentUserId?: number; // Add current user ID to determine if user owns the post
};

const PostContent = ({
  post,
  onCommentClick,
  onVote,
  currentUserId,
}: Props) => {
  const isOwnPost = currentUserId === post.user_id;

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return "🌍";
      case "followers":
        return "👥";
      case "private":
        return "🔒";
      default:
        return "🌍";
    }
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case "public":
        return "Public";
      case "followers":
        return "Followers";
      case "private":
        return "Private";
      default:
        return "Public";
    }
  };

  return (
    <div className="post-card">
      <div style={{ fontSize: 12, color: "#888" }}>
        {post.group && <span>[{post.group}] </span>}
        <span>
          {post.nickname} · {new Date(post.created_at).toLocaleString()}
        </span>
        {isOwnPost && post.privacy && (
          <span
            className={`privacy-badge ${post.privacy}`}
            style={{ marginLeft: 8 }}
          >
            {getPrivacyIcon(post.privacy)} {getPrivacyLabel(post.privacy)}
          </span>
        )}
      </div>
      <div style={{ fontSize: 22, fontWeight: "bold" }}>{post.title}</div>
      <div style={{ fontSize: 16, margin: "8px 0" }}>{post.content}</div>
      {post.image_paths && post.image_paths.length > 0 && (
        <PostImages images={post.image_paths} />
      )}
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
};

export default PostContent;
