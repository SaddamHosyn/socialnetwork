//import { loadUsers } from "./activity.js";

// Keep a map of chatId → Window reference
window.openChats = new Map();

export function openChat(receiverId, receiverNickname, chatId) {

  // If chat window allready open, just focus it
  const existing = window.openChats.get(chatId);
  if (existing && !existing.closed) {
    existing.focus();
    return;
  }

  //console.log("Opening private chat with:", receiverId, "nickname:", receiverNickname, "chatId:", chatId);

  const url = `index.html?chatId=${chatId}&chatReceiver=${receiverId}&chatName=${encodeURIComponent(receiverNickname)}`;
  const win = window.open(url, `_blank`, `width=400,height=500`);

  // If popup blocked or failed, win could be null
  if (win) {
    window.openChats.set(chatId, win);
    // When the user closes the window, remove it from our map
    const timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        window.openChats.delete(chatId);
      }
    }, 500);
  }
}

const params = new URLSearchParams(window.location.search);
const chatId = parseInt(params.get('chatId'));
const receiverId = parseInt(params.get('chatReceiver'));
const chatName = params.get('chatName');

// Only render once we have the needed params
if (chatId && receiverId && chatName) {
  //const ws = new WebSocket('ws://localhost:8080/ws');
  const ws = window.opener.ws;
  console.log("uusi ws")
  console.log("Chat parameters:", { chatId, receiverId, chatName });

  document.body.innerHTML = `
   <div class="chat-window" id="private-chat-popup">
  <h2>Private Chat with ${chatName}</h2>
  <div class="messagearea" id="messagesOutput"></div>

  <div class="input-area">
  <!-- Typing indicator above input -->
  <div id="typing-indicator" class="typing-indicator" style="display: none;">
  
  <span style="margin-right: 5px">${chatName} is typing </span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>

  <!-- Input box and button on same row -->
  <div class="input-row">
    <textarea class="input-box" id="messageInput" placeholder="Message to ${chatName}"></textarea>
    <button id="submit" class="send">Send</button>
  </div>
</div>
  `;

  let offset = 0;
  const limit = 10;
  let loading = false;
  let hasMore = true;


  // grab the elements
  const messagesOutput = document.getElementById('messagesOutput');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('submit');
  loadMessages();

  messagesOutput.addEventListener('scroll', async () => {
    if (messagesOutput.scrollTop === 0 && hasMore && !loading) {
      await loadMessages();
    }
  });

  async function loadMessages() {
    loading = true;
    try {
      const res = await fetch(`/api/chat/history?receiverId=${receiverId}&limit=${limit}&offset=${offset}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        if (data.messages.length < limit) hasMore = false; // No more messages
        offset += data.messages.length;

        const scrollPosition = messagesOutput.scrollHeight;

        data.messages.forEach(msg => {
          if (!msg.message || msg.message.trim() === '') return;
          const div = document.createElement('div');
          div.className = msg.sender_id === receiverId
            ? 'message incoming'
            : 'message outgoing';
          div.innerHTML = `
            ${msg.sender_name ? `<span class="message-sender">${msg.sender_name}</span>` : ''}
            <span class="message-text">${msg.message}</span>
            <span class="message-time">
              ${new Date(msg.time).toLocaleString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
            </span>
          `;
          messagesOutput.prepend(div);
        });

        // Restore scroll position after prepending
        messagesOutput.scrollTop = messagesOutput.scrollHeight - scrollPosition;
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => { loading = false; }, 300)
  }

  //***TYPING IN PROCES***//
  let canSendTyping = true;

  messageInput.addEventListener('input', () => {
    if (!canSendTyping) return;
  
    const msgData = {
      type: 'typing',
      chatId,
      receiverId,
    };
    ws.send(JSON.stringify(msgData));
    canSendTyping = false;
  
    // Reset throttle after 1 second
    setTimeout(() => {
      canSendTyping = true;
    }, 1000);
  });
  //***TYPING IN PROCESS***/
  

  // SEND MESSAGE
  sendButton.onclick = () => {
    const message = messageInput.value.trim();
    if (!message) return;

    const now = new Date();
    const timeStr = now;

    const msgData = {
      type: 'message',
      chatId,
      receiverId,
      message,
      time: timeStr
    };

    ws.send(JSON.stringify(msgData));
    messageInput.value = '';

  };

  // RECEIVE A MESSAGE or typing info
  const typingIndicator = document.getElementById('typing-indicator');

  ws.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'typing':
        if (data.sender_id === receiverId) {
          typingIndicator.style.display = 'flex';
  
          // Clear previous timeout if it exists
          clearTimeout(window.typingTimeout);
  
          // Hide indicator after 1.5 seconds of no typing activity
          window.typingTimeout = setTimeout(() => {
            typingIndicator.style.display = 'none';
          }, 1500);
        }
        break;
  
        case 'message':
          typingIndicator.style.display = 'none';
        
          const isIncoming = data.sender_id === receiverId;
        
          const msg = document.createElement('div');
          msg.className = `message ${isIncoming ? 'incoming' : 'outgoing'}`;
          msg.innerHTML = `
            <span class="message-sender">${data.sender_name}</span>
            <span class="message-text">${data.message}</span>
            <span class="message-time">${formatDate(data.time)}</span>
          `;
          messagesOutput.appendChild(msg);
          messagesOutput.scrollTop = messagesOutput.scrollHeight;
          break;  
    }
  });
}

function formatDate(date) {
  let msgTime;
  if (typeof date === "string") {
    msgTime = new Date(date);
  } else {
    msgTime = date
  }

  return msgTime.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

}
