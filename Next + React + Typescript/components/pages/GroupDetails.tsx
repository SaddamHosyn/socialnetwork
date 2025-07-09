"use client";
import { useState, useEffect } from "react";
import { Group, GroupPost, GroupEvent } from "../../types/groups";

interface GroupDetailsProps {
  groupId: number;
  onBack: () => void;
}

const GroupDetails = ({ groupId, onBack }: GroupDetailsProps) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "members">("posts");

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupPosts();
    fetchGroupEvents();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/groups/details?id=${groupId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        setGroup(result.data || result);
      }
    } catch (err) {
      setError("Failed to load group details");
    }
  };

  const fetchGroupPosts = async () => {
    try {
      const response = await fetch(`/api/groups/posts?group_id=${groupId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        setPosts(result.data || result || []);
      }
    } catch (err) {
      console.error("Failed to load group posts:", err);
    }
  };

  const fetchGroupEvents = async () => {
    try {
      const response = await fetch(`/api/groups/events?group_id=${groupId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        setEvents(result.data || result || []);
      }
    } catch (err) {
      console.error("Failed to load group events:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('group_id', groupId.toString());
      formData.append('content', content);
      formData.append('title', 'Group Post'); // Default title

      const response = await fetch('/api/groups/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (response.ok) {
        fetchGroupPosts(); // Refresh posts
        return true;
      } else {
        throw new Error('Failed to create post');
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
      return false;
    }
  };

  if (loading) return <div className="loading-spinner">Loading group details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!group) return <div className="error-message">Group not found</div>;

  return (
    <div className="group-details">
      <div className="group-header">
        <button onClick={onBack} className="back-button">
          ← Back to Groups
        </button>
        <div className="group-info">
          <h1>{group.title}</h1>
          <p>{group.description}</p>
          <div className="group-stats">
            <span>{group.member_count} members</span>
            <span>Created by: {group.creator_nickname}</span>
          </div>
        </div>
      </div>

      <div className="group-tabs">
        <button 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({posts.length})
        </button>
        <button 
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events ({events.length})
        </button>
      </div>

      <div className="group-content">
        {activeTab === 'posts' && (
          <div className="posts-section">
            {group.is_member && (
              <PostCreator onCreatePost={createPost} />
            )}
            <div className="posts-list">
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <span className="post-author">{post.nickname}</span>
                      <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="post-content">{post.content}</div>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  <p>No posts yet. {group.is_member ? "Be the first to post!" : "Join the group to see posts."}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            {group.is_member && (
              <div className="create-event-button">
                <button className="primary-button">+ Create Event</button>
              </div>
            )}
            <div className="events-list">
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event.id} className="event-card">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-meta">
                      <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                      <span>👤 {event.creator_nickname}</span>
                    </div>
                    <div className="event-responses">
                      <span>✅ Going: {event.going_count}</span>
                      <span>❌ Not Going: {event.not_going_count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  <p>No events yet. {group.is_member ? "Create the first event!" : "Join the group to see events."}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface PostCreatorProps {
  onCreatePost: (content: string) => Promise<boolean>;
}

const PostCreator = ({ onCreatePost }: PostCreatorProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const success = await onCreatePost(content);
    if (success) {
      setContent("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="post-creator">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share with the group..."
          rows={3}
          required
        />
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupDetails;
