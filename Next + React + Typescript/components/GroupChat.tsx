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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      console.log(`Fetching messages for group ${groupId}`);
      const response = await fetch(
        `/api/groups/chat/messages?group_id=${groupId}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Fetched messages response:", result);
        const messages = result.data?.messages || [];
        console.log("Setting messages:", messages);
        setMessages(messages);
      } else {
        console.error(
          "Failed to fetch messages:",
          response.status,
          response.statusText
        );
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

  const getSessionToken = (): string | null => {
    console.log("All cookies:", document.cookie);
    const cookies = document.cookie.split(';');
    console.log("Parsed cookies:", cookies);
    
    for (let cookie of cookies) {
      const [name, value] = cookie.split('=').map(c => c.trim());
      console.log(`Cookie: ${name} = ${value}`);
      if (name === 'session_token') {
        console.log("Found session token:", value);
        return value;
      }
    }
    console.log("No session_token cookie found");
    return null;
  };

  const connectWebSocket = () => {
    // Close existing connection if any
    if (websocket && websocket.readyState !== WebSocket.CLOSED) {
      console.log("Closing existing WebSocket connection");
      websocket.close();
    }

    // Don't create a new connection if one is already connecting
    if (websocket && websocket.readyState === WebSocket.CONNECTING) {
      console.log("WebSocket already connecting, skipping");
      return;
    }

    console.log("Creating new WebSocket connection");

    // Get session token for authentication
    const sessionToken = getSessionToken();
    
    let wsUrl = `ws://localhost:8080/ws`;
    if (sessionToken) {
      console.log("Using session token from cookie");
      wsUrl = `ws://localhost:8080/ws?token=${sessionToken}`;
    } else {
      console.log("No session token found, trying direct connection (cookies should be sent automatically)");
      console.log("If WebSocket connection fails, please make sure you are logged in");
      // Try without token - cookies might still be sent for same-origin requests
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setWebsocket(ws); // Set the websocket state after successful connection
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        if (message.type === "group_message" && message.group_id === groupId) {
          // Add the new message to the chat
          const newGroupMessage: ChatMessage = {
            id: message.id || Date.now() + Math.random(),
            group_id: message.group_id,
            sender_id: message.sender_id,
            sender_name: message.sender_name,
            content: message.message,
            created_at: message.time,
          };

          console.log("Processing new group message:", newGroupMessage);

          setMessages((prev) => {
            // Check if this exact message already exists by ID
            const existsById = prev.some((m) => m.id === newGroupMessage.id);
            if (existsById) {
              console.log("Message already exists by ID, skipping");
              return prev;
            }

            console.log("Adding new message to chat");
            return [...prev, newGroupMessage];
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setWebsocket(null);
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        if (isGroupMember && currentUser) {
          console.log("Attempting to reconnect WebSocket");
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWebsocket(null);
    };
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

  // Separate effect for handling messages and WebSocket after user is loaded
  useEffect(() => {
    if (isGroupMember && currentUser) {
      console.log(
        "Loading messages and connecting WebSocket for group",
        groupId
      );
      fetchMessages();

      // Only connect WebSocket if we don't already have one
      if (!websocket || websocket.readyState === WebSocket.CLOSED) {
        connectWebSocket();
      }
    }
  }, [isGroupMember, currentUser, groupId]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        console.log("Component unmounting, closing WebSocket connection");
        websocket.close();
        setWebsocket(null);
      }
    };
  }, [groupId]); // Clean up when groupId changes

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
    if (!newMessage.trim() || sending || !isGroupMember || !currentUser) return;

    const messageContent = newMessage.trim();
    console.log("Sending message:", messageContent);
    setNewMessage(""); // Clear input immediately for better UX
    setSending(true);

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

      const result = await response.json();
      console.log("Message sent successfully:", result);
      // No need to add message to UI since we filter out own messages
    } catch (err) {
      console.error("Error sending message:", err);
      setNewMessage(messageContent); // Restore message in input on error
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
                {messages
                  .filter((message) => {
                    // Only show messages from other users, not your own
                    return !(currentUser && message.sender_id === currentUser.id);
                  })
                  .map((message, index, filteredMessages) => {
                    const previousMessage = filteredMessages[index - 1];
                    const showDateDivider =
                      !previousMessage ||
                      formatDate(message.created_at) !==
                        formatDate(previousMessage.created_at);

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
                        <div className="message-wrapper other-message">
                          <div className="message-bubble">
                            <div className="message-avatar">
                              <img
                                src={getAvatarUrl()}
                                alt={`${message.sender_name}'s avatar`}
                                className="avatar-image"
                              />
                            </div>
                            <div className="message-content">
                              <div className="message-author">
                                {message.sender_name}
                              </div>
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

        .emoji-picker {
          position: absolute;
          bottom: 100%;
          left: 28px;
          background: white;
          border: 1px solid #e1e5e9;
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

        .emoji-toggle-button {
          background: linear-gradient(135deg, #f7fafc, #edf2f7);
          border: none;
          padding: 12px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .emoji-toggle-button:hover {
          background: linear-gradient(135deg, #edf2f7, #e2e8f0);
          transform: scale(1.05);
        }

        .message-form {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .message-input-container {
          padding: 16px;
          background: white;
          border-top: 1px solid #e1e5e9;
          position: relative;
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
