// profile.js
import { UI } from "./ui.js";
import { makeCarousel, singlePost } from "./posts.js";

export function userProfile(data) {
  const feed = document.getElementById("post-feed");
  window.profileScrollPosition = feed.scrollTop;
  UI.hideAll();
  UI.show("profile-container");

  const info = document.getElementById("profile-info");
  info.innerHTML = `
    <p><strong>Nickname:</strong> ${data.user.nickname}</p>
    <p><strong>Full Name:</strong> ${data.user.first_name} ${data.user.last_name}</p>
    <p><strong>Date Of Birth:</strong> ${data.user.date_of_birth}</p>
    <p><strong>Gender:</strong> ${data.user.gender}</p>
    <p><strong>Email:</strong> ${data.user.email}</p>
    <h3>Your Posts</h3>
    <div id="profile-posts"></div>
    <h3>Your Comments</h3>
    <ul id="profile-comments"></ul>
  `;

  // render posts with carousel
  const postsEl = document.getElementById("profile-posts");
  data.posts.forEach((p) => {
    const div = document.createElement("div");
    div.className = "post";
    div.dataset.id = p.id;
    div.innerHTML = `
      <div class="post-meta">
        <span class="author">${data.user.nickname}</span>
        <span class="datetime">${new Date(p.created_at).toLocaleString()}</span>
      </div>
      <h3 class="post-title">${p.title}</h3>
      <p class="post-content">${p.content}</p>
      <div class="post-tags">
        ${p.categories.map((c) => `<span class="tag">${c}</span>`).join(" ")}
      </div>
      <div class="post-actions">
        <button class="vote up" onclick="vote(${p.id},null,1)">⬆️</button>
        <span>${p.votes}</span>
        <button class="vote down" onclick="vote(${p.id},null,-1)">⬇️</button>
        <button class="comment-btn">💬</button>
      </div>
    `;
    const upBtn = div.querySelector(".vote.up");
    const downBtn = div.querySelector(".vote.down");

    upBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      vote(p.id, null, 1);
    });

    downBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      vote(p.id, null, -1);
    });
    // carousel
    if (Array.isArray(p.image_paths) && p.image_paths.length) {
      const paths = p.image_paths.map((s) =>
        s.replace("./uploads/", "/uploads/")
      );
      div.insertBefore(makeCarousel(paths), div.querySelector(".post-tags"));
    }
    // wire comment button
    div
      .querySelector(".comment-btn")
      .addEventListener("click", () => singlePost(p.id));

    postsEl.appendChild(div);
  });

  // render comments
  const comEl = document.getElementById("profile-comments");
  data.comments.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = `${c.content} – Votes: ${c.votes}`;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => singlePost(c.post_id));
    comEl.appendChild(li);
  });
}
