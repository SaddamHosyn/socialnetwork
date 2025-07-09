import PostContent from "./PostContent";
import type { Post } from "../types/types";

type Props = {
  posts: Post[];
  loading: boolean;
  onPostSelect: (postId: number) => void;
  onVote: (postId: number, vote: 1 | -1) => void;
};

const PostList: React.FC<Props> = ({
  posts,
  loading,
  onPostSelect,
  onVote,
}) => {
  if (loading) return <div>Loading...</div>;
  if (posts.length === 0) return <div>No posts yet.</div>;

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{ marginBottom: 32, cursor: "pointer" }}
          onClick={() => onPostSelect(post.id)}
        >
          <PostContent post={post} onVote={(v) => onVote(post.id, v)} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
