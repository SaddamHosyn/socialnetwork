import PostContent from "./PostContent";
import CommentList from "./CommentList";
import CommentCreate from "./CommentCreate";
import type { Post } from "../types/types";

type Props = {
  post: Post | null;
  onClose: () => void;
  onVote: (postId: number, vote: 1 | -1) => void;
};

const PostSingle: React.FC<Props> = ({ post, onClose, onVote }) => {
  // Loading state is now handled by the parent
  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={onClose}>Back</button>
      <PostContent post={post} onVote={(v) => onVote(post.id, v)} />
      <h3>Comments</h3>
      <CommentList postId={post.id} />
      <CommentCreate postId={post.id} onCommentAdded={() => {}} />
    </div>
  );
};

export default PostSingle;
