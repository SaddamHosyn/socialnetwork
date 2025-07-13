"use client";
import { useState, useEffect } from "react";
import PostContent from "./PostContent";
import FollowersList from "./FollowersList";
import FollowRequestsList from "./FollowRequestsList";
import type { ProfileData } from "../types/types";
import { getAvatarUrl, getUserInitials } from "../utils/imageUtils";

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "activity" | "followers" | "following" | "requests">("posts");

  useEffect(() => {
    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['posts', 'activity', 'followers', 'following', 'requests'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, []);
  const [updatingPrivacy, setUpdatingPrivacy] = useState(false);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });

  const togglePrivacy = async () => {
    if (!profile) return;
    
    setUpdatingPrivacy(true);
    try {
      const response = await fetch("/api/profile/privacy", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          is_private: profile.user.is_private ? "0" : "1",
        }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(prev => prev ? {
            ...prev,
            user: { ...prev.user, is_private: !prev.user.is_private }
          } : null);
        }
      }
    } catch (error) {
      console.error("Error updating privacy:", error);
    } finally {
      setUpdatingPrivacy(false);
    }
  };

  const fetchFollowStats = async () => {
    if (!profile?.user.id) return;
    
    try {
      // Fetch followers count
      const followersRes = await fetch(`/api/follow/followers?user_id=${profile.user.id}`, { credentials: "include" });
      
      if (followersRes.ok) {
        const followersData = await followersRes.json();
        
        // Fetch following count  
        const followingRes = await fetch(`/api/follow/following?user_id=${profile.user.id}`, { credentials: "include" });
        
        if (followingRes.ok) {
          const followingData = await followingRes.json();
          
          setFollowStats({
            followers: followersData.followers ? followersData.followers.length : 0,
            following: followingData.following ? followingData.following.length : 0,
          });
        } else {
          console.warn("Failed to fetch following data:", followingRes.status);
          setFollowStats({ followers: 0, following: 0 });
        }
      } else {
        console.warn("Failed to fetch followers data:", followersRes.status);
        setFollowStats({ followers: 0, following: 0 });
      }
    } catch (error) {
      console.error("Error fetching follow stats:", error);
      setFollowStats({ followers: 0, following: 0 });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.user.id) {
      fetchFollowStats();
    }
  }, [profile?.user.id]);

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
          <img
            src={getAvatarUrl(user.avatar)}
            alt="Profile Avatar"
            className="profile-avatar-modern"
          />
        </div>

        <div className="profile-info-modern">
          <h1 className="profile-name-modern">{user.nickname}</h1>
          <p className="profile-email-modern">{user.email}</p>

          {/* Privacy Toggle */}
          <div className="privacy-toggle-section">
            <button
              onClick={togglePrivacy}
              disabled={updatingPrivacy}
              className={`privacy-toggle-button ${user.is_private ? 'private' : 'public'}`}
            >
              {updatingPrivacy ? 'Updating...' : (
                <>
                  <span className="privacy-icon">
                    {user.is_private ? '🔒' : '🌐'}
                  </span>
                  <span className="privacy-text">
                    {user.is_private ? 'Private Account' : 'Public Account'}
                  </span>
                </>
              )}
            </button>
            <p className="privacy-description">
              {user.is_private 
                ? 'Your posts are hidden from other users' 
                : 'Your posts are visible to all users'
              }
            </p>
          </div>

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
              <span 
                className="stat-number-modern clickable"
                onClick={() => setActiveTab("followers")}
                style={{ cursor: 'pointer' }}
              >
                {followStats.followers}
              </span>
              <span className="stat-label-modern">Followers</span>
            </div>
            <div className="stat-item-modern">
              <span 
                className="stat-number-modern clickable"
                onClick={() => setActiveTab("following")}
                style={{ cursor: 'pointer' }}
              >
                {followStats.following}
              </span>
              <span className="stat-label-modern">Following</span>
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
          <button
            className={`tab-modern ${activeTab === "followers" ? "active" : ""}`}
            onClick={() => setActiveTab("followers")}
          >
            👥 Followers
            <span className="tab-count">({followStats.followers})</span>
          </button>
          <button
            className={`tab-modern ${activeTab === "following" ? "active" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            🔗 Following
            <span className="tab-count">({followStats.following})</span>
          </button>
          <button
            className={`tab-modern ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            📬 Follow Requests
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

          {activeTab === "followers" && profile?.user.id && (
            <div className="followers-section-modern">
              <FollowersList userId={profile.user.id} type="followers" />
            </div>
          )}

          {activeTab === "following" && profile?.user.id && (
            <div className="following-section-modern">
              <FollowersList userId={profile.user.id} type="following" />
            </div>
          )}

          {activeTab === "requests" && (
            <div className="requests-section-modern">
              <FollowRequestsList onRequestUpdate={fetchFollowStats} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
