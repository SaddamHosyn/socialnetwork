"use client";
import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import type { ProfileData } from "../types/types";

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "activity">("posts");

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
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
          <p>We couldn't load your profile. Please try again.</p>
        </div>
      </div>
    );
  }

  const { user, posts } = profile;
  const postList = Array.isArray(posts) ? posts : [];

  return (
    <div className="profile-page-modern">
      {/* Centered Profile Header */}
      <div className="profile-header-modern">
        <div className="profile-avatar-section-modern">
          {user.avatar && user.avatar.trim() !== "" ? (
            <img
              src={user.avatar}
              alt="Profile Avatar"
              className="profile-avatar-modern"
            />
          ) : (
            <div className="profile-avatar-placeholder-modern">
              <span className="avatar-initials-modern">
                {user.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="profile-info-modern">
          <h1 className="profile-name-modern">{user.nickname}</h1>
          <p className="profile-email-modern">{user.email}</p>

          <div className="profile-stats-modern">
            <div className="stat-item-modern">
              <span className="stat-number-modern">{postList.length}</span>
              <span className="stat-label-modern">Posts</span>
            </div>
            <div className="stat-item-modern">
              <span className="stat-number-modern">
                {postList.reduce((acc, post) => acc + (post.votes || 0), 0)}
              </span>
              <span className="stat-label-modern">Total Votes</span>
            </div>
            <div className="stat-item-modern">
              <span className="stat-number-modern">
                {postList.reduce(
                  (acc, post) => acc + (post.comments_count || 0),
                  0
                )}
              </span>
              <span className="stat-label-modern">Comments</span>
            </div>
            <div className="stat-item-modern">
              <span className="stat-number-modern">
                {new Date(user.created_at).getFullYear()}
              </span>
              <span className="stat-label-modern">Member Since</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Below */}
      <div className="profile-content-modern">
        <div className="profile-tabs-modern">
          <button
            className={`tab-modern ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            📝 My Posts
            <span className="tab-count">({postList.length})</span>
          </button>
          <button
            className={`tab-modern ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            📊 Activity Overview
          </button>
        </div>

        <div className="profile-tab-content-modern">
          {activeTab === "posts" && (
            <div className="posts-section-modern">
              {postList.length > 0 ? (
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
                  <p>
                    You haven't created any posts yet. Start sharing your
                    thoughts with the community!
                  </p>
                  <button
                    className="create-post-btn-profile"
                    onClick={() =>
                      (window.location.href = "/?page=posts&action=create")
                    }
                  >
                    Create Your First Post
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="activity-section-modern">
              <div className="activity-overview-modern">
                <h3>📈 Your Activity Overview</h3>

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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
