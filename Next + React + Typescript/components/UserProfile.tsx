"use client";
import { useState, useEffect } from "react";

import PostContent from "./PostContent";
import type { ProfileData } from "../types/types";

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

  const { user, posts } = profile;
  const postList = Array.isArray(posts) ? posts : [];

  console.log(user.avatar);

  return (
    <div>
      <h2>{user.nickname}'s Profile</h2>
      {user.avatar && user.avatar.trim() !== "" ? (
        <img
          src={user.avatar}
          alt="Avatar"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 12,
            border: "2px solid #eee",
          }}
        />
      ) : (
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#eee",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: "#bbb",
            fontWeight: "bold",
          }}
        >
          ?
        </div>
      )}
      <div>
        <b>Name:</b> {user.first_name} {user.last_name}
        <br />
        <b>Date of Birth:</b> {user.date_of_birth}
        <br />
        <b>Gender:</b> {user.gender}
        <br />
        <b>Email:</b> {user.email}
      </div>
      <div style={{ marginBottom: 24 }}></div>

      <h3>User's Posts</h3>
      <div>
        {postList.length === 0 ? (
          <div>No posts yet.</div>
        ) : (
          postList.map((post) => <PostContent key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default UserProfile;
