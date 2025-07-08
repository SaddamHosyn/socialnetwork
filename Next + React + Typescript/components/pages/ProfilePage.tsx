"use client";
import UserProfile from "../UserProfile";

const ProfilePage = () => (
  <div className="profile-page">
    <div className="page-header">
      <h1>My Profile</h1>
    </div>
    <div className="profile-content">
      <UserProfile />
    </div>
  </div>
);

export default ProfilePage;
