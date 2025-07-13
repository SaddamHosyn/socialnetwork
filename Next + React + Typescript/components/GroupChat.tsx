"use client";
import { useState, useEffect, useRef } from "react";
import { getAvatarUrl } from "../utils/imageUtils";

interface ChatMessage {
  id: number;
  group_id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  created_at: string;
  isOptimistic?: boolean; // Flag to identify optimistic messages
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

interface CurrentUser {
  id: number;
  nickname: string;
  email?: string;
}

const GroupChat = ({ groupId, isGroupMember }: GroupChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/groups/chat/messages?group_id=${groupId}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessages(result.data?.messages || []);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/me", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        // Handle both direct user data and wrapped responses
        const user = userData.data || userData;
        setCurrentUser(user);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const connectWebSocket = () => {
    // Close existing connection if any
    if (websocket) {
      websocket.close();
      setWebsocket(null);
    }

    const ws = new WebSocket(`ws://localhost:8080/ws`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "group_message" && message.group_id === groupId) {
          // Add the new message to the chat
          const newGroupMessage: ChatMessage = {
            id: message.id || Date.now() + Math.random(), // Use actual message ID from backend
            group_id: message.group_id,
            sender_id: message.sender_id,
            sender_name: message.sender_name,
            content: message.message,
            created_at: message.time,
            isOptimistic: false, // Mark as real message from server
          };

          setMessages((prev) => {
            // Check if message already exists by ID to prevent duplicates
            const existsById = prev.some((m) => m.id === newGroupMessage.id);
            if (existsById) {
              return prev;
            }

            // If this is from the current user, remove any optimistic messages with the same content
            let filteredPrev = prev;
            if (currentUser && newGroupMessage.sender_id === currentUser.id) {
              filteredPrev = prev.filter((m) => {
                // Remove optimistic messages with the same content
                const isSameContent =
                  m.sender_id === newGroupMessage.sender_id &&
                  m.content === newGroupMessage.content;

                if (m.isOptimistic && isSameContent) {
                  return false; // Remove this message
                }
                return true; // Keep this message
              });
            }

            // Also check by content and sender to catch any other duplicates
            const existsByContent = filteredPrev.some(
              (m) =>
                m.sender_id === newGroupMessage.sender_id &&
                m.content === newGroupMessage.content &&
                Math.abs(
                  new Date(m.created_at).getTime() -
                    new Date(newGroupMessage.created_at).getTime()
                ) < 2000
            );

            if (existsByContent) {
              return prev;
            }

            return [...filteredPrev, newGroupMessage];
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      // Try to reconnect after 3 seconds, but only if we don't have an active connection
      setTimeout(() => {
        if (!websocket || websocket.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWebsocket(ws);
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
    fetchCurrentUser();
    fetchMembers();
  }, [groupId]);

  useEffect(() => {
    if (isGroupMember && currentUser) {
      fetchMessages();
      connectWebSocket();
    }

    // Cleanup WebSocket on unmount or dependency change
    return () => {
      if (websocket) {
        websocket.close();
        setWebsocket(null);
      }
    };
  }, [groupId, isGroupMember, currentUser]);

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
    if (!newMessage.trim() || sending || !isGroupMember || !currentUser) return;

    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX
    setSending(true);

    // Create optimistic message
    const optimisticMessage: ChatMessage = {
      id: Date.now() + Math.random(), // Temporary unique ID with decimal
      group_id: groupId,
      sender_id: currentUser.id,
      sender_name: currentUser.nickname,
      content: messageContent,
      created_at: new Date().toISOString(),
      isOptimistic: true, // Mark as optimistic
    };

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const response = await fetch("/api/groups/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          group_id: groupId,
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      // On success, we don't need to do anything - WebSocket will handle the real message
      // and our duplicate detection will replace the optimistic message
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setNewMessage(messageContent); // Restore message in input
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  if (!currentUser) {
    return (
      <div className="chat-section">
        <div className="access-denied">
          <h3>Group Chat</h3>
          <p>You need to be logged in to access the chat.</p>
        </div>
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
                  const showDateDivider =
                    !previousMessage ||
                    formatDate(message.created_at) !==
                      formatDate(previousMessage.created_at);
                  const isOwnMessage =
                    currentUser && message.sender_id === currentUser.id;

                  // Create a unique key combining multiple factors to prevent duplicates
                  const uniqueKey = `msg-${message.id}-${message.sender_id}-${index}-${message.created_at}`;

                  return (
                    <div key={uniqueKey}>
                      {showDateDivider && (
                        <div
                          className="date-divider"
                          key={`date-${formatDate(
                            message.created_at
                          )}-${index}`}
                        >
                          {formatDate(message.created_at)}
                        </div>
                      )}
                      <div
                        className={`message-wrapper ${
                          isOwnMessage ? "own-message" : "other-message"
                        }`}
                      >
                        <div className="message-bubble">
                          {!isOwnMessage && (
                            <div className="message-avatar">
                              <img
                                src={getAvatarUrl()}
                                alt={`${message.sender_name}'s avatar`}
                                className="avatar-image"
                              />
                            </div>
                          )}
                          <div className="message-content">
                            {!isOwnMessage && (
                              <div className="message-author">
                                {message.sender_name}
                              </div>
                            )}
                            <div className="message-text">
                              {message.content}
                            </div>
                            <div className="message-time">
                              {formatTime(message.created_at)}
                            </div>
                          </div>
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
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
        }

        .date-divider {
          text-align: center;
          margin: 16px 0;
          color: #666;
          font-size: 12px;
          font-weight: bold;
        }

        .message-wrapper {
          display: flex;
          margin-bottom: 12px;
          width: 100%;
        }

        .message-wrapper.own-message {
          justify-content: flex-end;
        }

        .message-wrapper.other-message {
          justify-content: flex-start;
        }

        .message-bubble {
          display: flex;
          max-width: 70%;
          align-items: flex-end;
          gap: 8px;
        }

        .own-message .message-bubble {
          flex-direction: row-reverse;
        }

        .other-message .message-bubble {
          flex-direction: row;
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .avatar-image {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .message-content {
          border-radius: 18px;
          padding: 12px 16px;
          word-wrap: break-word;
          position: relative;
        }

        .own-message .message-content {
          background: #007bff;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .other-message .message-content {
          background: #e9ecef;
          color: #333;
          border-bottom-left-radius: 4px;
        }

        .message-author {
          font-weight: 600;
          font-size: 12px;
          margin-bottom: 4px;
          opacity: 0.8;
        }

        .own-message .message-author {
          color: #fff;
        }

        .other-message .message-author {
          color: #007bff;
        }

        .message-text {
          line-height: 1.4;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
          text-align: right;
        }

        .own-message .message-time {
          color: #fff;
        }

        .other-message .message-time {
          color: #666;
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
          transition: background-color 0.2s;
        }

        .send-button:hover:not(:disabled) {
          background: #0056b3;
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
