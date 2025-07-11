"use client";
import { useState, useEffect, useCallback } from "react";
import { Group, GroupPost, GroupEvent } from "../types/groups";
import GroupComments from "./GroupComments";

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
  const [activeTab, setActiveTab] = useState<
    "posts" | "events" | "members" | "create-event"
  >("posts");
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );

  const fetchGroupDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/details?id=${groupId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        setGroup(result.data || result);
      }
    } catch {
      setError("Failed to load group details");
    }
  }, [groupId]);

  const fetchGroupPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/posts?group_id=${groupId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        setPosts(result.data || result || []);
      }
    } catch (err) {
      console.error("Failed to load group posts:", err);
    }
  }, [groupId]);

  const fetchGroupEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/events?group_id=${groupId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Fetched events data:", result);
        setEvents(result.data || result || []);
      }
    } catch (err) {
      console.error("Failed to load group events:", err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupPosts();
    fetchGroupEvents();
  }, [fetchGroupDetails, fetchGroupPosts, fetchGroupEvents]);

  const createPost = async (content: string, imageFile?: File) => {
    try {
      const formData = new FormData();
      formData.append("group_id", groupId.toString());
      formData.append("content", content);
      formData.append("title", "Group Post"); // Default title

      if (imageFile) {
        formData.append("images", imageFile);
        console.log(
          "Creating post with image:",
          imageFile.name,
          imageFile.type,
          imageFile.size
        );
      } else {
        console.log("Creating text-only post");
      }

      const response = await fetch("/api/groups/posts/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      console.log(
        "Post creation response:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        console.log("Post created successfully, refreshing posts...");
        await fetchGroupPosts(); // Refresh posts
        return true;
      } else {
        const errorText = await response.text();
        console.error("Post creation failed:", response.status, errorText);
        throw new Error("Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
      return false;
    }
  };

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleRSVP = async (
    eventId: number,
    response: "going" | "not_going"
  ) => {
    try {
      console.log(
        `Attempting RSVP for event ${eventId} with response: ${response}`
      );
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("event_id", eventId.toString());
      formData.append("response", response);

      console.log("Sending RSVP request with data:", {
        event_id: eventId,
        response: response,
      });

      const apiResponse = await fetch("/api/groups/events/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData.toString(),
      });

      console.log("RSVP API response status:", apiResponse.status);

      if (apiResponse.ok) {
        // Refresh events to get updated counts and user response
        console.log("RSVP successful, refreshing events...");
        await fetchGroupEvents();

        // Show success message
        const actionText =
          response === "going" ? "marked as going" : "marked as not going";
        console.log(`Successfully ${actionText} for event`);
      } else {
        const errorData = await apiResponse.text();
        console.error("RSVP failed:", apiResponse.status, errorData);
        throw new Error(`Failed to update RSVP: ${apiResponse.status}`);
      }
    } catch (error) {
      console.error("Error updating RSVP:", error);
      alert("Failed to update RSVP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="loading-spinner">Loading group details...</div>;
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
          className={`tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts ({posts.length})
        </button>
        <button
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events ({events.length})
        </button>
      </div>

      <div className="group-content">
        {activeTab === "posts" && (
          <div className="posts-section">
            {group.is_member && <PostCreator onCreatePost={createPost} />}
            <div className="posts-list">
              {posts.length > 0 ? (
                posts.map((post) => {
                  console.log(
                    "Rendering post:",
                    post.id,
                    "image_paths:",
                    post.image_paths
                  );
                  return (
                    <div key={post.id} className="post-card">
                      <div className="post-header">
                        <span className="post-author">{post.nickname}</span>
                        <span className="post-time">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="post-content">{post.content}</div>

                      {/* Display post images if they exist */}
                      {post.image_paths && post.image_paths.length > 0 && (
                        <div className="post-images">
                          {post.image_paths.map((imagePath, index) => {
                            const imageUrl = `http://localhost:8080${imagePath.replace(
                              /^\./,
                              ""
                            )}`;
                            console.log("Rendering image:", imageUrl);
                            return (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`Post image ${index + 1}`}
                                className="post-image"
                                onLoad={() =>
                                  console.log("Image loaded:", imageUrl)
                                }
                                onError={() =>
                                  console.error(
                                    "Image failed to load:",
                                    imageUrl
                                  )
                                }
                              />
                            );
                          })}
                        </div>
                      )}

                      <div className="post-actions">
                        <button
                          className="comments-toggle"
                          onClick={() => toggleComments(post.id)}
                        >
                          💬 Comments ({post.comments_count})
                        </button>
                      </div>

                      {/* Comments section */}
                      {expandedComments.has(post.id) && (
                        <div className="comments-section">
                          <GroupComments postId={post.id} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="no-content">
                  <p>
                    No posts yet.{" "}
                    {group.is_member
                      ? "Be the first to post!"
                      : "Join the group to see posts."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="events-section">
            {group.is_member && (
              <div className="create-event-button">
                <button
                  className="primary-button"
                  onClick={() => {
                    console.log("Create Event button clicked!");
                    setActiveTab("create-event");
                  }}
                >
                  + Create Event
                </button>
              </div>
            )}
            <div className="events-list">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <div className="event-meta">
                        <span>
                          📅 {new Date(event.event_date).toLocaleDateString()}{" "}
                          at {new Date(event.event_date).toLocaleTimeString()}
                        </span>
                        <span>👤 Created by {event.creator_nickname}</span>
                      </div>
                    </div>

                    <div className="event-description">
                      <p>{event.description}</p>
                    </div>

                    {/* RSVP Section */}
                    {group.is_member && (
                      <div className="event-rsvp-section">
                        <div className="rsvp-buttons">
                          <button
                            className={`rsvp-button going ${
                              event.user_response === "going" ? "selected" : ""
                            }`}
                            onClick={() => handleRSVP(event.id, "going")}
                            disabled={loading}
                          >
                            ✅ Going ({event.going_count})
                          </button>
                          <button
                            className={`rsvp-button not-going ${
                              event.user_response === "not_going"
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleRSVP(event.id, "not_going")}
                            disabled={loading}
                          >
                            ❌ Not Going ({event.not_going_count})
                          </button>
                        </div>

                        {/* Response Status */}
                        <div className="current-response">
                          {event.user_response ? (
                            <span
                              className={`response-status ${event.user_response}`}
                            >
                              You are{" "}
                              {event.user_response === "going"
                                ? "going"
                                : "not going"}{" "}
                              to this event
                            </span>
                          ) : (
                            <span className="response-status no-response">
                              You haven't responded yet
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Event Stats for non-members */}
                    {!group.is_member && (
                      <div className="event-stats">
                        <span>✅ Going: {event.going_count}</span>
                        <span>❌ Not Going: {event.not_going_count}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-content">
                  <p>
                    No events yet.{" "}
                    {group.is_member
                      ? "Create the first event!"
                      : "Join the group to see events."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "create-event" && (
          <div className="create-event-section">
            <h2>Create New Event</h2>
            <EventCreator
              groupId={groupId}
              onEventCreated={() => {
                setActiveTab("events");
                fetchGroupEvents(); // Refresh events list
              }}
              onCancel={() => setActiveTab("events")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface PostCreatorProps {
  onCreatePost: (content: string, imageFile?: File) => Promise<boolean>;
}

const PostCreator = ({ onCreatePost }: PostCreatorProps) => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const success = await onCreatePost(content, selectedImage || undefined);
    if (success) {
      setContent("");
      setSelectedImage(null);
    }
    setIsSubmitting(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
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

        {/* Image upload section */}
        <div className="image-upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            style={{ display: "none" }}
            id="post-image-upload"
          />
          <label htmlFor="post-image-upload" className="image-upload-label">
            📷 Add Image
          </label>

          {selectedImage && (
            <div className="selected-image">
              <span>{selectedImage.name}</span>
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

interface EventCreatorProps {
  groupId: number;
  onEventCreated: () => void;
  onCancel: () => void;
}

const EventCreator = ({
  groupId,
  onEventCreated,
  onCancel,
}: EventCreatorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !eventDate) return;

    setIsSubmitting(true);
    try {
      // Convert datetime-local format to RFC3339 format
      const eventDateRFC3339 = new Date(eventDate).toISOString();

      const formData = new URLSearchParams();
      formData.append("group_id", groupId.toString());
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("event_date", eventDateRFC3339);

      console.log("Creating event with data:", {
        group_id: groupId.toString(),
        title: title.trim(),
        description: description.trim(),
        event_date: eventDateRFC3339,
        original_event_date: eventDate,
      });

      const response = await fetch("/api/groups/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData.toString(),
      });

      if (response.ok) {
        onEventCreated();
        setTitle("");
        setDescription("");
        setEventDate("");
      } else {
        // Get the error details from the server
        const errorData = await response.text();
        console.error("Server response:", response.status, errorData);
        throw new Error(
          `Failed to create event: ${response.status} - ${errorData}`
        );
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current date in YYYY-MM-DDTHH:MM format for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="event-creator">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="event-title">Event Title:</label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title..."
            maxLength={100}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-description">Event Description:</label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your event..."
            rows={4}
            maxLength={500}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-date">Event Date & Time:</label>
          <input
            id="event-date"
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            min={getCurrentDateTime()}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={
              isSubmitting || !title.trim() || !description.trim() || !eventDate
            }
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
          <button type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupDetails;
