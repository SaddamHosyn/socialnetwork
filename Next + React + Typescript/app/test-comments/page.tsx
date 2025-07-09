import GroupComments from "../../components/GroupComments";

export default function TestComments() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Comments Page</h1>
      <div style={{ marginTop: "20px" }}>
        <GroupComments postId={1} />
      </div>
    </div>
  );
}
