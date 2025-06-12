import { openChat } from "./chat.js";
import { renderComments } from "./comments.js";

// activity.js
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function sendHeartbeat() {
  if (!window.isLoggedIn?.()) return;

  fetch("/api/heartbeat", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) console.warn("Heartbeat failed:", response.statusText);
    })
    .catch(console.error);
}

export function initActivityTracking() {
  const throttledHeartbeat = throttle(sendHeartbeat, 60000);

  // Activity event listeners
  ["mousemove", "keydown", "scroll"].forEach((event) => {
    document.addEventListener(event, throttledHeartbeat);
  });

  // Initial heartbeat
  setTimeout(() => {
    if (window.isLoggedIn?.()) {
      sendHeartbeat();
    }
  }, 5000);
}

document.addEventListener("DOMContentLoaded", initActivityTracking);
window.throttle = throttle; // Only expose if needed elsewhere

export async function loadUsers() {
  // console.log('LOading userlist')

  // 1. Fetch all users (sending cookies/session)
  const res = await fetch("/api/users", { credentials: "include" });
  const json = await res.json();

  // 2. If the API says “no,” throw an exception
  if (!json.success) throw new Error(json.error);

  // 3. Find the container for our list (<div> or <ul>)
  const list = document.getElementById("user-list");
  if (!list) return;

  // 4. Clear any prior entries
  list.innerHTML = "";

  // 5. Build a <button> for each user
  json.data.forEach((user) => {
    if (user.id !== window.currentUserId) {
      // Create a button instead of an li
      const btn = document.createElement("button");
      btn.textContent = user.nickname;
      btn.className = user.online ? "online" : "offline";
      btn.style.cursor = "pointer";
      btn.setAttribute("data-user-id", user.id); // helpful for targeting later

      // Add button to user list
      const li = document.createElement("li");
      li.appendChild(btn);
      list.appendChild(li);

      // 6. On click, get or create the chat...
      btn.addEventListener("click", function handler() {
        fetch(`/api/chat?user=${user.id}`) // -> handleChatRequest checks if a chat is allready there
          .then((res) => res.json()) // returns chatId (new or old) as json data
          .then((data) => {
            if (data.success) {
              openChat(user.id, user.nickname, data.chatId); //open chat window
            } else {
              console.error("Chat API error:", data.error);
              btn.disabled = false;
            }
          })
          .catch((err) => {
            console.error("Network error:", err);
            btn.disabled = false;
          });
      });
    }
  });
}
