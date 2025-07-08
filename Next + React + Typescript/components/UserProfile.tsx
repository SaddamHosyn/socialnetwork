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

  const { user, posts, follower_count, following_count } = profile;
  const postList = Array.isArray(posts) ? posts : [];

  return (
    <div>
      <h2>
        {(user.nickname ?? "").trim() !== ""
          ? user.nickname
          : `${user.first_name} ${user.last_name}`}{" "}
        Profile
      </h2>
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
        <br />
        <b>Followers:</b> {follower_count ?? 0}
        <br />
        <b>Following:</b> {following_count ?? 0}
        {(user.about_me ?? "").trim() !== "" && (
          <div style={{ margin: "12px 0" }}>
            <b>About Me:</b>
            <br />
            <span>{user.about_me}</span>
          </div>
        )}
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
