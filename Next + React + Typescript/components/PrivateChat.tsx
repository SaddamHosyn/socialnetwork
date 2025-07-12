"use client";
import { useState, useEffect, useRef } from "react";

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
  email: string;
  avatar_path?: string;
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
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
      // Mock users for now - replace with actual API call
      const mockUsers: User[] = [
        {
          id: 1,
          nickname: "john_doe",
          email: "john@example.com",
          isOnline: true,
          lastMessage: "Hey, how are you?",
          lastMessageTime: "2025-07-12T15:30:00Z",
          unreadCount: 2,
        },
        {
          id: 2,
          nickname: "jane_smith",
          email: "jane@example.com",
          isOnline: false,
          lastMessage: "Thanks for the help!",
          lastMessageTime: "2025-07-12T14:20:00Z",
          unreadCount: 0,
        },
        {
          id: 3,
          nickname: "bob_wilson",
          email: "bob@example.com",
          isOnline: true,
          lastMessage: "See you tomorrow",
          lastMessageTime: "2025-07-12T13:15:00Z",
          unreadCount: 1,
        },
        {
          id: 4,
          nickname: "alice_brown",
          email: "alice@example.com",
          isOnline: false,
          lastMessage: "Good night!",
          lastMessageTime: "2025-07-11T22:45:00Z",
          unreadCount: 0,
        },
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: number) => {
    try {
      // Mock messages for now - replace with actual API call
      const mockMessages: ChatMessage[] = [
        {
          id: 1,
          sender_id: userId,
          sender_name: "john_doe",
          receiver_id: currentUser?.id || 0,
          receiver_name: currentUser?.nickname || "",
          content: "Hey there! How are you doing?",
          created_at: "2025-07-12T10:30:00Z",
        },
        {
          id: 2,
          sender_id: currentUser?.id || 0,
          sender_name: currentUser?.nickname || "",
          receiver_id: userId,
          receiver_name: "john_doe",
          content: "I'm doing great! Thanks for asking. How about you?",
          created_at: "2025-07-12T10:32:00Z",
        },
        {
          id: 3,
          sender_id: userId,
          sender_name: "john_doe",
          receiver_id: currentUser?.id || 0,
          receiver_name: currentUser?.nickname || "",
          content:
            "Same here! Just working on some projects. What have you been up to lately?",
          created_at: "2025-07-12T10:35:00Z",
        },
      ];

      setMessages(mockMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
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
      console.log("Private chat WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "private_message") {
          const newMessage: ChatMessage = {
            id: message.id || Date.now() + Math.random(),
            sender_id: message.sender_id,
            sender_name: message.sender_name,
            receiver_id: message.receiver_id,
            receiver_name: message.receiver_name,
            content: message.message,
            created_at: message.time,
            isOptimistic: false,
          };

          // Only add message if it's related to the currently selected user
          if (
            selectedUser &&
            ((newMessage.sender_id === selectedUser.id &&
              newMessage.receiver_id === currentUser?.id) ||
              (newMessage.sender_id === currentUser?.id &&
                newMessage.receiver_id === selectedUser.id))
          ) {
            setMessages((prev) => {
              const existsById = prev.some((m) => m.id === newMessage.id);
              if (existsById) return prev;

              // Remove optimistic messages when real one arrives
              let filteredPrev = prev;
              if (currentUser && newMessage.sender_id === currentUser.id) {
                filteredPrev = prev.filter(
                  (m) => !(m.isOptimistic && m.content === newMessage.content)
                );
              }

              return [...filteredPrev, newMessage];
            });
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("Private chat WebSocket disconnected");
      setTimeout(() => {
        if (!websocket || websocket.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("Private chat WebSocket error:", error);
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
        setWebsocket(null);
      }
    };
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedUser || !currentUser) return;

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
      // Mock API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In real implementation, this would be:
      // const response = await fetch("/api/chat/send", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     receiver_id: selectedUser.id,
      //     content: messageContent,
      //   }),
      // });

      console.log("Message sent successfully (mock)");
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setNewMessage(messageContent);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath) return "/uploads/avatars/default_avatar.svg";
    return `http://localhost:8080${avatarPath.replace(/^\./, "")}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Now";
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading-spinner">Loading chat...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="chat-page">
        <div className="access-denied">
          <h2>Private Chat</h2>
          <p>You need to be logged in to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Users List */}
        <div className="users-sidebar">
          <div className="sidebar-header">
            <h2>Chats</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                }`}
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
                  {user.lastMessage && (
                    <div className="last-message">{user.lastMessage}</div>
                  )}
                  {user.lastMessageTime && (
                    <div className="last-message-time">
                      {formatTime(user.lastMessageTime)}
                    </div>
                  )}
                </div>
                {user.unreadCount && user.unreadCount > 0 && (
                  <div className="unread-badge">{user.unreadCount}</div>
                )}
              </div>
            ))}
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
                      {selectedUser.isOnline ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.length > 0 ? (
                  messages.map((message, index) => {
                    const isOwnMessage =
                      currentUser && message.sender_id === currentUser.id;
                    const uniqueKey = `msg-${message.id}-${message.sender_id}-${index}-${message.created_at}`;

                    return (
                      <div key={uniqueKey}>
                        <div
                          className={`message-wrapper ${
                            isOwnMessage ? "own-message" : "other-message"
                          }`}
                        >
                          <div className="message-bubble">
                            {!isOwnMessage && (
                              <div className="message-avatar">
                                <img
                                  src={getAvatarUrl(selectedUser.avatar_path)}
                                  alt={`${message.sender_name}'s avatar`}
                                  className="avatar-image"
                                />
                              </div>
                            )}
                            <div className="message-content">
                              <div className="message-text">
                                {message.content}
                              </div>
                              <div className="message-time">
                                {formatMessageTime(message.created_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <form onSubmit={sendMessage} className="message-form">
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
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <h3>Select a user to start chatting</h3>
              <p>Choose someone from the list to begin your conversation</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
        }

        .chat-container {
          display: flex;
          flex: 1;
          min-height: 0;
        }

        .users-sidebar {
          width: 350px;
          background: white;
          border-right: 1px solid #e1e5e9;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e1e5e9;
        }

        .sidebar-header h2 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 24px;
        }

        .search-bar {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 1px solid #e1e5e9;
          border-radius: 25px;
          font-size: 14px;
          outline: none;
          background: #f8f9fa;
        }

        .search-input:focus {
          border-color: #007bff;
          background: white;
        }

        .search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 16px;
        }

        .users-list {
          flex: 1;
          overflow-y: auto;
        }

        .user-item {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          border-bottom: 1px solid #f1f3f4;
          transition: background-color 0.2s;
          position: relative;
        }

        .user-item:hover {
          background: #f8f9fa;
        }

        .user-item.selected {
          background: #e3f2fd;
          border-right: 3px solid #007bff;
        }

        .user-avatar {
          position: relative;
          margin-right: 12px;
        }

        .avatar-image {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #28a745;
          border: 2px solid white;
          border-radius: 50%;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
          font-size: 16px;
        }

        .last-message {
          color: #666;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }

        .last-message-time {
          color: #999;
          font-size: 12px;
        }

        .unread-badge {
          background: #007bff;
          color: white;
          border-radius: 50%;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          margin-left: 8px;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .chat-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e1e5e9;
          background: white;
          display: flex;
          align-items: center;
        }

        .chat-user-info {
          display: flex;
          align-items: center;
        }

        .header-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 12px;
        }

        .header-user-name {
          font-weight: 600;
          color: #333;
          font-size: 18px;
        }

        .header-user-status {
          color: #666;
          font-size: 14px;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px 24px;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
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

        .message-avatar .avatar-image {
          width: 32px;
          height: 32px;
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
          background: white;
          color: #333;
          border-bottom-left-radius: 4px;
          border: 1px solid #e1e5e9;
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

        .no-chat-selected {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
          color: #666;
        }

        .no-chat-selected h3 {
          margin-bottom: 8px;
          color: #333;
        }

        .message-input-container {
          padding: 16px 24px;
          background: white;
          border-top: 1px solid #e1e5e9;
        }

        .message-form {
          display: flex;
          gap: 12px;
        }

        .message-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e1e5e9;
          border-radius: 25px;
          outline: none;
          font-size: 14px;
          background: #f8f9fa;
        }

        .message-input:focus {
          border-color: #007bff;
          background: white;
        }

        .send-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          width: 48px;
          height: 48px;
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

        .access-denied {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
          color: #666;
        }

        .access-denied h2 {
          margin-bottom: 16px;
          color: #333;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #666;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default PrivateChat;
