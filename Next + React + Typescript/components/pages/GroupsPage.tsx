"use client";
import { useState, useEffect } from "react";
import { useGroups } from "../../hooks/useGroups";
import { Group } from "../../types/groups";

const GroupsPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const { groups, loading, error, createGroup, fetchGroups } = useGroups();
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    privacy: "public"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch groups when component mounts
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Please enter a group name");
      return;
    }
    
    if (!formData.description.trim()) {
      alert("Please enter a group description");
      return;
    }
    
    if (formData.title.length < 3 || formData.title.length > 50) {
      alert("Group name must be between 3 and 50 characters");
      return;
    }
    
    if (formData.description.length < 10 || formData.description.length > 500) {
      alert("Group description must be between 10 and 500 characters");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createGroup({
        name: formData.title,
        description: formData.description
      });
      
      // Reset form and switch back to list view
      setFormData({ title: "", description: "", privacy: "public" });
      setViewMode("list");
      
      // Refresh the groups list
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          alert("You need to be logged in to create a group.");
        } else if (error.message.includes('400')) {
          alert("Please check your input and try again.");
        } else {
          alert(`Error: ${error.message}`);
        }
      } else {
        alert("Failed to create group. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", privacy: "public" });
    setViewMode("list");
  };

  return (
    <div className="groups-page">
      <div className="page-header">
        <h1>Groups</h1>
        <button onClick={() => setViewMode("create")} className="create-button">
          + Create Group
        </button>
      </div>

      {viewMode === "list" && (
        <div className="groups-content">
          {loading && <p>Loading groups...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && (
            <div className="groups-grid">
              {groups.length > 0 ? (
                groups.map((group: Group) => (
                  <div key={group.id} className="group-card">
                    <h3>{group.title}</h3>
                    <p>{group.description || "No description available"}</p>
                    <div className="group-meta">
                      <span>{group.member_count || 0} members</span>
                      <span>Created by: {group.creator_nickname}</span>
                      <button className="join-button">
                        {group.is_member ? "Leave" : "Join"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-groups">
                  <p>No groups found. Create the first one!</p>
                  <button onClick={() => setViewMode("create")} className="create-button">
                    Create Group
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {viewMode === "create" && (
        <div className="create-group-view">
          <div className="page-header">
            <button onClick={handleCancel} className="back-button">
              ← Back to Groups
            </button>
            <h2>Create New Group</h2>
          </div>
          <div className="create-group-form">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Group Name</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter group name (3-50 characters)" 
                  required
                  minLength={3}
                  maxLength={50}
                />
                <small>{formData.title.length}/50 characters</small>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your group (10-500 characters)" 
                  rows={4}
                  required
                  minLength={10}
                  maxLength={500}
                />
                <small>{formData.description.length}/500 characters</small>
              </div>
              <div className="form-group">
                <label>Privacy</label>
                <select 
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleInputChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}>
                  {isSubmitting ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
