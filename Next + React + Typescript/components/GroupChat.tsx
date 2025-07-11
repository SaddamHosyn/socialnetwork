"use client";
import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: number;
  user_id: number;
  nickname: string;
  avatar_path?: string;
  message: string;
  created_at: string;
}

interface Member {
  id: number;
  nickname: string;
  avatar_path?: string;
}

interface GroupChatProps {
  groupId: number;
  isGroupMember: boolean;
}

const GroupChat = ({ groupId, isGroupMember }: GroupChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      // This would be your chat messages API endpoint
      const response = await fetch(`/api/groups/chat?group_id=${groupId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(result.data || result || []);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/groups/members?group_id=${groupId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        const membersList = result.data || result || [];
        setMembers(membersList);
        setFilteredMembers(membersList);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGroupMember) {
      fetchMessages();
    }
    fetchMembers();
  }, [groupId, isGroupMember]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((member) =>
        member.nickname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !isGroupMember) return;

    setSending(true);
    try {
      const formData = new URLSearchParams();
      formData.append("group_id", groupId.toString());
      formData.append("message", newMessage.trim());

      const response = await fetch("/api/groups/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData.toString(),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh messages
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath) return "/uploads/avatars/default_avatar.png";
    return `http://localhost:8080${avatarPath.replace(/^\./, "")}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="chat-section">
        <div className="loading-spinner">Loading chat...</div>
      </div>
    );
  }

  if (!isGroupMember) {
    return (
      <div className="chat-section">
        <div className="access-denied">
          <h3>Group Chat</h3>
          <p>You need to be a member of this group to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-section">
      <div className="chat-header">
        <h2>Group Chat</h2>
        <button
          className="members-toggle"
          onClick={() => setShowMembersPanel(!showMembersPanel)}
        >
          👥 Members ({members.length})
        </button>
      </div>

      <div className="chat-container">
        <div className="chat-main">
          <div className="messages-container">
            {messages.length > 0 ? (
              <>
                {messages.map((message, index) => {
                  const previousMessage = messages[index - 1];
                  const showDateDivider = !previousMessage || 
                    formatDate(message.created_at) !== formatDate(previousMessage.created_at);

                  return (
                    <div key={message.id}>
                      {showDateDivider && (
                        <div className="date-divider">
                          {formatDate(message.created_at)}
                        </div>
                      )}
                      <div className="message">
                        <div className="message-avatar">
                          <img
                            src={getAvatarUrl(message.avatar_path)}
                            alt={`${message.nickname}'s avatar`}
                            className="avatar-image"
                          />
                        </div>
                        <div className="message-content">
                          <div className="message-header">
                            <span className="message-author">{message.nickname}</span>
                            <span className="message-time">
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                          <div className="message-text">{message.message}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="send-button"
              >
                {sending ? "⏳" : "📤"}
              </button>
            </form>
          </div>
        </div>

        {showMembersPanel && (
          <div className="members-panel">
            <div className="members-panel-header">
              <h3>Online Members</h3>
              <button
                className="close-panel"
                onClick={() => setShowMembersPanel(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="members-list">
              {filteredMembers.map((member) => (
                <div key={member.id} className="member-item">
                  <img
                    src={getAvatarUrl(member.avatar_path)}
                    alt={`${member.nickname}'s avatar`}
                    className="member-avatar"
                  />
                  <span className="member-name">{member.nickname}</span>
                  <div className="online-status"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .chat-section {
          height: 600px;
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e1e5e9;
        }

        .chat-header h2 {
          margin: 0;
          color: #333;
        }

        .members-toggle {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .chat-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #fafafa;
        }

        .date-divider {
          text-align: center;
          margin: 16px 0;
          color: #666;
          font-size: 12px;
          font-weight: bold;
        }

        .message {
          display: flex;
          margin-bottom: 12px;
        }

        .message-avatar {
          margin-right: 12px;
        }

        .avatar-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .message-content {
          flex: 1;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .message-author {
          font-weight: bold;
          color: #333;
          font-size: 14px;
        }

        .message-time {
          color: #666;
          font-size: 12px;
        }

        .message-text {
          color: #333;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .no-messages {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .message-input-container {
          padding: 16px;
          background: white;
          border-top: 1px solid #e1e5e9;
        }

        .message-form {
          display: flex;
          gap: 8px;
        }

        .message-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #e1e5e9;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
        }

        .message-input:focus {
          border-color: #007bff;
        }

        .send-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .members-panel {
          width: 250px;
          background: white;
          border-left: 1px solid #e1e5e9;
          display: flex;
          flex-direction: column;
        }

        .members-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e1e5e9;
        }

        .members-panel-header h3 {
          margin: 0;
          font-size: 14px;
          color: #333;
        }

        .close-panel {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #666;
        }

        .search-bar {
          position: relative;
          padding: 12px;
          border-bottom: 1px solid #e1e5e9;
        }

        .search-input {
          width: 100%;
          padding: 8px 30px 8px 12px;
          border: 1px solid #e1e5e9;
          border-radius: 15px;
          font-size: 12px;
          outline: none;
        }

        .search-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 12px;
        }

        .members-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .member-item {
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
        }

        .member-item:hover {
          background: #f8f9fa;
        }

        .member-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 8px;
          object-fit: cover;
        }

        .member-name {
          flex: 1;
          font-size: 12px;
          color: #333;
        }

        .online-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #28a745;
          margin-left: 4px;
        }

        .access-denied {
          text-align: center;
          padding: 40px;
        }

        .access-denied h3 {
          color: #333;
          margin-bottom: 16px;
        }

        .access-denied p {
          color: #666;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default GroupChat;
