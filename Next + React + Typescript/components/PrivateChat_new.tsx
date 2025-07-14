"use client";
import { useState, useEffect, useRef } from "react";
import { getAvatarUrl } from "../utils/imageUtils";

interface ChatMessage {
  id: number;
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  receiver_name: string;
  content: string;
  created_at: string;
  isOptimistic?: boolean;
}

interface User {
  id: number;
  nickname: string;
  avatar_path?: string;
  isOnline?: boolean;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  follow_status?: string; // "mutual", "you_follow", "follows_you", "none"
  can_chat?: boolean;
}

interface CurrentUser {
  id: number;
  nickname: string;
  email?: string;
}

const PrivateChat = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/me", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        const user = userData.data || userData;
        setCurrentUser(user);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      // First try to get users with chat history
      const response = await fetch("/api/private/chat/users", {
        credentials: "include",
      });

      let usersList = [];
      if (response.ok) {
        const result = await response.json();
        usersList = result.data?.users || result.users || [];
      }

      // Also get all available users with follow status
      const availableResponse = await fetch("/api/private/chat/available", {
        credentials: "include",
      });

      if (availableResponse.ok) {
        const availableResult = await availableResponse.json();
        const availableUsers =
          availableResult.data?.users || availableResult.users || [];

        // Merge chat history users with available users, avoiding duplicates
        const allUsers = [...usersList];
        availableUsers.forEach((user: User) => {
          if (!allUsers.find((u) => u.id === user.id)) {
            allUsers.push(user);
          }
        });

        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } else {
        setUsers(usersList);
        setFilteredUsers(usersList);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: number) => {
    try {
      console.log(`Fetching messages with user ${userId}`);
      const response = await fetch(
        `/api/private/chat/messages?receiver_id=${userId}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Fetched messages response:", result);
        const messages = result.data?.messages || result.messages || [];
        console.log("Setting messages:", messages);
        setMessages(messages);
      } else {
        console.error("Failed to fetch messages:", response.status);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const connectWebSocket = () => {
    if (!currentUser) return;

    const ws = new WebSocket("ws://localhost:8080/ws");
    ws.onopen = () => {
      console.log("WebSocket connected for private chat");
      ws.send(
        JSON.stringify({
          type: "register",
          user_id: currentUser.id,
          nickname: currentUser.nickname,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        if (
          data.type === "private_message" ||
          (!data.type && data.sender_id && data.receiver_id)
        ) {
          const isForCurrentChat =
            selectedUser &&
            ((data.sender_id === currentUser.id &&
              data.receiver_id === selectedUser.id) ||
              (data.sender_id === selectedUser.id &&
                data.receiver_id === currentUser.id));

          if (isForCurrentChat) {
            const newMessage: ChatMessage = {
              id: data.id || Date.now(),
              sender_id: data.sender_id,
              sender_name: data.sender_name || "Unknown",
              receiver_id: data.receiver_id,
              receiver_name: data.receiver_name || "Unknown",
              content: data.content || data.message,
              created_at:
                data.created_at || data.time || new Date().toISOString(),
            };

            setMessages((prev) => {
              // Remove optimistic message if this is the real one
              const filtered = prev.filter(
                (msg) => !msg.isOptimistic || msg.content !== newMessage.content
              );

              // Avoid duplicates
              if (filtered.find((msg) => msg.id === newMessage.id)) {
                return filtered;
              }

              return [...filtered, newMessage];
            });
          }

          // Update user list last message
          fetchUsers();
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWebsocket(ws);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      connectWebSocket();
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = [
    "😀",
    "😂",
    "🥰",
    "😍",
    "🤗",
    "🤔",
    "😎",
    "😊",
    "👍",
    "👎",
    "❤️",
    "💯",
    "🔥",
    "⭐",
    "🎉",
    "👏",
    "🙌",
    "🤝",
    "✨",
    "💫",
  ];

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedUser || !currentUser) return;

    // Check if user can send messages to selected user
    if (!selectedUser.can_chat) {
      alert(
        "You need to follow this user or they need to follow you to send messages."
      );
      return;
    }

    const messageContent = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Create optimistic message
    const optimisticMessage: ChatMessage = {
      id: Date.now() + Math.random(),
      sender_id: currentUser.id,
      sender_name: currentUser.nickname,
      receiver_id: selectedUser.id,
      receiver_name: selectedUser.nickname,
      content: messageContent,
      created_at: new Date().toISOString(),
      isOptimistic: true,
    };

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const response = await fetch("/api/private/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiver_id: selectedUser.id,
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const result = await response.json();
      console.log("Message sent successfully:", result);
      // WebSocket will handle the real message
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      setNewMessage(messageContent); // Restore message
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading-spinner">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Users Sidebar */}
        <div className="users-sidebar">
          <div className="sidebar-header">
            <h2>💬 Private Messages</h2>
            <div className="search-bar">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="users-list">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`user-item ${
                  selectedUser?.id === user.id ? "selected" : ""
                } ${!user.can_chat ? "disabled" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-avatar">
                  <img
                    src={getAvatarUrl(user.avatar_path)}
                    alt={`${user.nickname}'s avatar`}
                    className="avatar-image"
                  />
                  {user.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.nickname}</div>
                  {user.can_chat ? (
                    <>
                      {user.last_message && (
                        <div className="last-message">{user.last_message}</div>
                      )}
                      {user.last_message_time && (
                        <div className="last-message-time">
                          {formatTime(user.last_message_time)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="follow-to-text">Follow to text</div>
                  )}
                  {user.follow_status && user.follow_status !== "none" && (
                    <div className={`follow-status ${user.follow_status}`}>
                      {user.follow_status === "mutual" && "👥 Mutual"}
                      {user.follow_status === "you_follow" && "➡️ Following"}
                      {user.follow_status === "follows_you" && "⬅️ Follows you"}
                    </div>
                  )}
                </div>
                {user.unread_count && user.unread_count > 0 && (
                  <div className="unread-badge">{user.unread_count}</div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="no-users">
                <p>No users found</p>
                <small>Try following someone to start chatting!</small>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  <img
                    src={getAvatarUrl(selectedUser.avatar_path)}
                    alt={`${selectedUser.nickname}'s avatar`}
                    className="header-avatar"
                  />
                  <div>
                    <div className="header-user-name">
                      {selectedUser.nickname}
                    </div>
                    <div className="header-user-status">
                      {selectedUser.can_chat
                        ? selectedUser.follow_status === "mutual"
                          ? "Mutual followers"
                          : selectedUser.follow_status === "you_follow"
                          ? "You follow this user"
                          : selectedUser.follow_status === "follows_you"
                          ? "Follows you"
                          : "Can chat"
                        : "Follow to text"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.sender_id === currentUser?.id
                        ? "sent"
                        : "received"
                    } ${message.isOptimistic ? "optimistic" : ""}`}
                  >
                    <div className="message-content">
                      <div className="message-text">{message.content}</div>
                      <div className="message-time">
                        {formatTime(message.created_at)}
                        {message.isOptimistic && " ⏳"}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        className="emoji-button"
                        onClick={() => addEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
                {selectedUser.can_chat ? (
                  <form onSubmit={sendMessage} className="message-form">
                    <button
                      type="button"
                      className="emoji-toggle-button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      😊
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${selectedUser.nickname}...`}
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
                ) : (
                  <div className="follow-to-text-banner">
                    <p>💔 You need to follow each other to send messages</p>
                    <small>
                      At least one of you must follow the other to start
                      chatting
                    </small>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <h3>💭 Select a conversation</h3>
              <p>Choose someone from your connections to start chatting</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .chat-container {
          display: flex;
          flex: 1;
          min-height: 0;
          margin: 20px;
          border-radius: 20px;
          overflow: hidden;
          background: white;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .users-sidebar {
          width: 400px;
          background: #ffffff;
          border-right: 1px solid #e8ecf4;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .sidebar-header h2 {
          margin: 0 0 16px 0;
          color: white;
          font-size: 28px;
          font-weight: 700;
        }

        .search-bar {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 14px 45px 14px 18px;
          border: none;
          border-radius: 25px;
          font-size: 15px;
          outline: none;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.8);
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.3);
        }

        .search-icon {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
        }

        .users-list {
          flex: 1;
          overflow-y: auto;
          background: #fafbfc;
          padding: 8px;
        }

        .user-item {
          display: flex;
          align-items: center;
          padding: 18px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          background: white;
          border-radius: 16px;
          margin-bottom: 8px;
          border: 2px solid transparent;
        }

        .user-item:hover {
          background: #f8f9ff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.2);
        }

        .user-item.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
          border-color: transparent;
        }

        .user-item.disabled {
          opacity: 0.7;
          cursor: default;
        }

        .user-item.disabled:hover {
          transform: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-color: transparent;
        }

        .user-avatar {
          position: relative;
          margin-right: 16px;
        }

        .avatar-image {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(102, 126, 234, 0.1);
          transition: all 0.3s ease;
        }

        .user-item.selected .avatar-image {
          border-color: rgba(255, 255, 255, 0.8);
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          background: #10d876;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(16, 216, 118, 0.4);
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 6px;
          font-size: 17px;
          transition: color 0.3s ease;
        }

        .user-item.selected .user-name {
          color: white;
        }

        .last-message {
          color: #718096;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 6px;
          transition: color 0.3s ease;
        }

        .user-item.selected .last-message {
          color: rgba(255, 255, 255, 0.9);
        }

        .last-message-time {
          color: #a0aec0;
          font-size: 12px;
          transition: color 0.3s ease;
        }

        .user-item.selected .last-message-time {
          color: rgba(255, 255, 255, 0.8);
        }

        .follow-to-text {
          color: #e53e3e;
          font-size: 13px;
          font-weight: 600;
          font-style: italic;
        }

        .follow-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 4px;
          display: inline-block;
        }

        .follow-status.mutual {
          background: #c6f6d5;
          color: #22543d;
        }

        .follow-status.you_follow {
          background: #bee3f8;
          color: #2c5282;
        }

        .follow-status.follows_you {
          background: #fed7d7;
          color: #c53030;
        }

        .unread-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .no-users {
          text-align: center;
          padding: 40px 20px;
          color: #718096;
        }

        .no-users p {
          font-size: 16px;
          margin-bottom: 8px;
          color: #2d3748;
        }

        .no-users small {
          font-size: 14px;
          color: #a0aec0;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .chat-header {
          padding: 24px 28px;
          border-bottom: 1px solid #e8ecf4;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .chat-user-info {
          display: flex;
          align-items: center;
        }

        .header-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 16px;
          border: 3px solid #e8ecf4;
        }

        .header-user-name {
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .header-user-status {
          color: #718096;
          font-size: 14px;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px;
          background: linear-gradient(to bottom, #f8fafc, #edf2f7);
        }

        .message {
          display: flex;
          margin-bottom: 20px;
          animation: messageSlideIn 0.4s ease-out;
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.sent {
          justify-content: flex-end;
        }

        .message.received {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 75%;
          padding: 16px 20px;
          border-radius: 20px;
          position: relative;
          word-wrap: break-word;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .message.sent .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 8px;
        }

        .message.received .message-content {
          background: rgba(255, 255, 255, 0.9);
          color: #2d3748;
          border: 1px solid rgba(232, 236, 244, 0.6);
          border-bottom-left-radius: 8px;
        }

        .message.optimistic {
          opacity: 0.7;
        }

        .message-text {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 6px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.8;
          text-align: right;
        }

        .message.received .message-time {
          color: #a0aec0;
        }

        .message-input-container {
          padding: 20px 28px;
          background: white;
          border-top: 1px solid #e8ecf4;
          position: relative;
        }

        .emoji-picker {
          position: absolute;
          bottom: 100%;
          left: 28px;
          background: white;
          border: 1px solid #e8ecf4;
          border-radius: 16px;
          padding: 16px;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 8px;
          width: 320px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }

        .emoji-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .emoji-button:hover {
          background: #f7fafc;
          transform: scale(1.2);
        }

        .message-form {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .emoji-toggle-button {
          background: linear-gradient(135deg, #f7fafc, #edf2f7);
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .emoji-toggle-button:hover {
          background: linear-gradient(135deg, #edf2f7, #e2e8f0);
          transform: scale(1.05);
        }

        .message-input {
          flex: 1;
          padding: 16px 24px;
          border: 2px solid #e8ecf4;
          border-radius: 25px;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
          background: #fafbfc;
        }

        .message-input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .send-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .follow-to-text-banner {
          padding: 24px;
          text-align: center;
          background: linear-gradient(135deg, #fed7d7 0%, #fc8181 100%);
          color: #742a2a;
          border-radius: 16px;
          margin: 12px 0;
        }

        .follow-to-text-banner p {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .follow-to-text-banner small {
          font-size: 14px;
          opacity: 0.8;
        }

        .no-chat-selected {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #718096;
          text-align: center;
          padding: 40px;
        }

        .no-chat-selected h3 {
          font-size: 28px;
          margin-bottom: 12px;
          color: #2d3748;
        }

        .no-chat-selected p {
          font-size: 16px;
          color: #a0aec0;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: white;
          font-size: 20px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .chat-container {
            margin: 0;
            border-radius: 0;
            flex-direction: column;
          }

          .users-sidebar {
            width: 100%;
            max-height: 50vh;
          }

          .message-content {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivateChat;
