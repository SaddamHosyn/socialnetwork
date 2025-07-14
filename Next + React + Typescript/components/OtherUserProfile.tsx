"use client";
import { useState, useEffect } from "react";
import { FollowButton } from "./FollowButton";
import FollowersList from "./FollowersList";
import type { ProfileData } from "../types/types";
import { getAvatarUrl } from "../utils/imageUtils";

interface OtherUserProfileProps {
  userId: number;
  onBack: () => void;
}

const OtherUserProfile: React.FC<OtherUserProfileProps> = ({
  userId,
  onBack,
}) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "posts" | "activity" | "followers" | "following"
  >("posts");
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const response = await fetch("/api/me", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setIsCurrentUser(data.data.user.id === userId);
        }
      } catch (error) {
        console.error("Error checking current user:", error);
      }
    };

    checkCurrentUser();
  }, [userId]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/profile/user?user_id=${userId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setProfile(data.data);
        } else {
          console.error("Failed to fetch profile:", data.error);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  useEffect(() => {
    const fetchFollowStats = async () => {
      if (!userId) return;

      try {
        // Fetch followers count
        const followersRes = await fetch(
          `/api/follow/followers?user_id=${userId}`,
          {
            credentials: "include",
          }
        );

        if (followersRes.ok) {
          const followersData = await followersRes.json();

          // Fetch following count
          const followingRes = await fetch(
            `/api/follow/following?user_id=${userId}`,
            {
              credentials: "include",
            }
          );

          if (followingRes.ok) {
            const followingData = await followingRes.json();

            // Handle the response structure properly
            let followersArray = [];
            let followingArray = [];

            if (followersData.success && followersData.data) {
              followersArray =
                followersData.data.followers || followersData.data || [];
            } else {
              followersArray = followersData.followers || [];
            }

            if (followingData.success && followingData.data) {
              followingArray =
                followingData.data.following || followingData.data || [];
            } else {
              followingArray = followingData.following || [];
            }

            setFollowStats({
              followers: Array.isArray(followersArray)
                ? followersArray.length
                : 0,
              following: Array.isArray(followingArray)
                ? followingArray.length
                : 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching follow stats:", error);
        setFollowStats({ followers: 0, following: 0 });
      }
    };

    fetchFollowStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <div className="error-content">
          <div className="error-icon">😞</div>
          <h3>Profile not found</h3>
          <p>
            We couldn't load this user's profile. They may have a private
            account that you don't have access to.
          </p>
          <button onClick={onBack} className="back-button">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user, posts } = profile;
  const postList = Array.isArray(posts) ? posts : [];

  // Check if this is a private account with restricted access
  // (private user that current user is not following)
  const isPrivateAndRestricted =
    user.is_private &&
    (!user.email || user.email === "") &&
    (!user.first_name || user.first_name === "");

  return (
    <div className="profile-page-modern">
      {/* Back Button */}
      <div className="profile-back-nav">
        <button onClick={onBack} className="back-button">
          ← Back to Users
        </button>
      </div>

      {/* Profile Header */}
      <div className="profile-header-modern">
        <div className="profile-avatar-section-modern">
          <img
            src={getAvatarUrl(user.avatar)}
            alt="Profile Avatar"
            className="profile-avatar-modern"
          />
        </div>

        <div className="profile-info-modern">
          <h1 className="profile-name-modern">{user.nickname}</h1>

          {isPrivateAndRestricted ? (
            <div className="private-profile-notice">
              <div className="private-icon">🔒</div>
              <p>This account is private</p>
              <p>Follow to see their posts and profile details</p>
            </div>
          ) : (
            <>
              {user.email && (
                <p className="profile-email-modern">{user.email}</p>
              )}

              {/* User Information Section - Only show if we have detailed info */}
              {(user.first_name ||
                user.last_name ||
                user.email ||
                user.date_of_birth ||
                user.gender ||
                user.about_me) && (
                <div className="user-info-section">
                  <div className="user-info-grid">
                    {user.first_name && user.first_name.trim() !== "" && (
                      <div className="info-item">
                        <span className="info-label">First Name:</span>
                        <span className="info-value">{user.first_name}</span>
                      </div>
                    )}
                    {user.last_name && user.last_name.trim() !== "" && (
                      <div className="info-item">
                        <span className="info-label">Last Name:</span>
                        <span className="info-value">{user.last_name}</span>
                      </div>
                    )}
                    {user.nickname && user.nickname.trim() !== "" && (
                      <div className="info-item">
                        <span className="info-label">Nickname:</span>
                        <span className="info-value">{user.nickname}</span>
                      </div>
                    )}
                    {user.email && user.email.trim() !== "" && (
                      <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user.email}</span>
                      </div>
                    )}
                    {user.date_of_birth && (
                      <div className="info-item">
                        <span className="info-label">Date of Birth:</span>
                        <span className="info-value">
                          {new Date(user.date_of_birth).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {user.gender &&
                      user.gender.trim() !== "" &&
                      user.gender !== "Unknown" && (
                        <div className="info-item">
                          <span className="info-label">Gender:</span>
                          <span className="info-value">{user.gender}</span>
                        </div>
                      )}
                    {user.about_me && user.about_me.trim() !== "" && (
                      <div className="info-item about-me">
                        <span className="info-label">About Me:</span>
                        <span className="info-value">{user.about_me}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Privacy Badge */}
          <div className="privacy-badge-section">
            <span
              className={`privacy-badge ${
                user.is_private ? "private" : "public"
              }`}
            >
              {user.is_private ? "🔒 Private Account" : "🌐 Public Account"}
            </span>
          </div>

          {/* Follow Button */}
          {!isCurrentUser && (
            <div className="follow-action-section">
              <FollowButton userId={userId} />
            </div>
          )}

          <div className="profile-stats-modern">
            <div className="stat-item-modern">
              <span className="stat-number-modern">{postList.length}</span>
              <span className="stat-label-modern">Posts</span>
            </div>
            <div className="stat-item-modern">
              <span
                className="stat-number-modern clickable"
                onClick={() => setActiveTab("followers")}
                style={{ cursor: "pointer" }}
              >
                {followStats.followers}
              </span>
              <span className="stat-label-modern">Followers</span>
            </div>
            <div className="stat-item-modern">
              <span
                className="stat-number-modern clickable"
                onClick={() => setActiveTab("following")}
                style={{ cursor: "pointer" }}
              >
                {followStats.following}
              </span>
              <span className="stat-label-modern">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content-modern">
        <div className="profile-tabs-modern">
          <button
            className={`tab-modern ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            📝 Posts
            <span className="tab-count">({postList.length})</span>
          </button>
          <button
            className={`tab-modern ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            📊 Activity Overview
          </button>
          <button
            className={`tab-modern ${
              activeTab === "followers" ? "active" : ""
            }`}
            onClick={() => setActiveTab("followers")}
          >
            👥 Followers
            <span className="tab-count">({followStats.followers})</span>
          </button>
          <button
            className={`tab-modern ${
              activeTab === "following" ? "active" : ""
            }`}
            onClick={() => setActiveTab("following")}
          >
            🔗 Following
            <span className="tab-count">({followStats.following})</span>
          </button>
        </div>

        <div className="profile-tab-content-modern">
          {activeTab === "posts" && (
            <div className="posts-section-modern">
              {isPrivateAndRestricted ? (
                <div className="private-posts-notice">
                  <div className="private-icon-large">🔒</div>
                  <h3>This account is private</h3>
                  <p>Follow {user.nickname} to see their posts</p>
                </div>
              ) : postList.length > 0 ? (
                <div className="posts-grid-profile">
                  {postList.map((post) => (
                    <div key={post.id} className="profile-post-card-modern">
                      <div className="post-header-modern">
                        <h3 className="post-title-modern">{post.title}</h3>
                        <span className="post-date-modern">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="post-content-preview">
                        <div className="post-content-text">
                          {post.content.substring(0, 150)}...
                        </div>
                      </div>

                      <div className="post-footer-modern">
                        <div className="post-stats-modern">
                          <div className="stat-badge">
                            <span className="stat-icon">👍</span>
                            <span>{post.votes || 0}</span>
                          </div>
                          <div className="stat-badge">
                            <span className="stat-icon">💬</span>
                            <span>{post.comments_count || 0}</span>
                          </div>
                        </div>

                        {post.categories && post.categories.length > 0 && (
                          <div className="post-categories-modern">
                            {post.categories.map((categoryName, index) => (
                              <span key={index} className="category-tag-modern">
                                {categoryName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-posts-profile">
                  <div className="no-posts-icon-modern">📝</div>
                  <h3>No posts yet</h3>
                  <p>{user.nickname} hasn't shared any posts yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="activity-section-modern">
              <div className="activity-overview-modern">
                <h3>📈 Activity Overview</h3>

                <div className="activity-stats-grid">
                  <div className="activity-stat-card-modern">
                    <div className="stat-icon-modern">📝</div>
                    <div className="stat-content-modern">
                      <span className="stat-number-large">
                        {postList.length}
                      </span>
                      <span className="stat-label-activity">Total Posts</span>
                    </div>
                  </div>

                  <div className="activity-stat-card-modern">
                    <div className="stat-icon-modern">👍</div>
                    <div className="stat-content-modern">
                      <span className="stat-number-large">
                        {postList.reduce(
                          (acc, post) => acc + (post.votes || 0),
                          0
                        )}
                      </span>
                      <span className="stat-label-activity">
                        Votes Received
                      </span>
                    </div>
                  </div>

                  <div className="activity-stat-card-modern">
                    <div className="stat-icon-modern">💬</div>
                    <div className="stat-content-modern">
                      <span className="stat-number-large">
                        {postList.reduce(
                          (acc, post) => acc + (post.comments_count || 0),
                          0
                        )}
                      </span>
                      <span className="stat-label-activity">
                        Total Comments
                      </span>
                    </div>
                  </div>

                  <div className="activity-stat-card-modern">
                    <div className="stat-icon-modern">📅</div>
                    <div className="stat-content-modern">
                      <span className="stat-number-large">
                        {user.created_at
                          ? Math.floor(
                              (Date.now() -
                                new Date(user.created_at).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : 0}
                      </span>
                      <span className="stat-label-activity">Days Active</span>
                    </div>
                  </div>
                </div>

                {postList.length > 0 && (
                  <div className="recent-activity-modern">
                    <h4>🕒 Recent Posts</h4>
                    <div className="recent-posts-list-modern">
                      {postList
                        .sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        )
                        .slice(0, 5)
                        .map((post) => (
                          <div
                            key={post.id}
                            className="recent-post-item-modern"
                          >
                            <div className="recent-post-info-modern">
                              <h5>{post.title}</h5>
                              <span className="recent-post-date-modern">
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="recent-post-stats-modern">
                              <span>👍 {post.votes || 0}</span>
                              <span>💬 {post.comments_count || 0}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "followers" && (
            <div className="followers-section-modern">
              <FollowersList userId={userId} type="followers" />
            </div>
          )}

          {activeTab === "following" && (
            <div className="following-section-modern">
              <FollowersList userId={userId} type="following" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
