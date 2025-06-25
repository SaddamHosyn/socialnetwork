import React, { useEffect, useState } from "react";
import PostContent from "./PostContent";
import CommentContent from "./CommentContent";
import type { Post, Comment } from "../types";

type User = {
  id: number;
  nickname: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // or Date if parsed
  gender: string;
  email: string;
};

type ProfileData = {
  user: User;
  posts: Post[];
  comments: Comment[];
};

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (!profile) return <div>Profile not found.</div>;

  const { user, posts, comments } = profile;

  return (
    <div>
      <h2>{user.nickname}'s Profile</h2>
      <div>
        <b>Name:</b> {user.first_name} {user.last_name}
        <br />
        <b>Date of Birth:</b> {user.date_of_birth}
        <br />
        <b>Gender:</b> {user.gender}
        <br />
        <b>Email:</b> {user.email}
      </div>

      <button /* logout logic here */>Logout</button>

      <h3>User's Posts</h3>
      <div>
        {posts.map((post) => (
          <PostContent key={post.id} post={post} />
        ))}
      </div>

      <h3>User's Comments</h3>
      <div>
        {comments.map((comment) => (
          <CommentContent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
