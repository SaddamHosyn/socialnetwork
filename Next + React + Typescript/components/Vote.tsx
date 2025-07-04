type Props = {
  votes: number;
  onVote: (v: 1 | -1) => void;
  userVote?: 1 | -1 | 0;
};

const Vote = ({ votes, onVote, userVote = 0 }: Props) => (
  <span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onVote(1);
      }}
      style={{ color: userVote === 1 ? "#15803d" : "#444" }}
      aria-label="Upvote"
    >
      ⬆️
    </button>
    <span style={{ margin: "0 8px", fontWeight: 600 }}>{votes}</span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onVote(-1);
      }}
      style={{ color: userVote === -1 ? "#dc2626" : "#444" }}
      aria-label="Downvote"
    >
      ⬇️
    </button>
  </span>
);

export default Vote;
