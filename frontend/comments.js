// comments.js
import { UI } from './ui.js';

export let cOffset = 0;
export const cLimit = 20;
export let loadingComments = false;

// 1) Fetch & render
export async function loadComments(postId) {
  if (loadingComments) return;
  loadingComments = true;

  try {
    const res = await fetch(
      `/api/comment/fetch?post_id=${postId}&limit=${cLimit}&offset=${cOffset}`,
      { credentials: 'include' }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { success, data, error } = await res.json();
    if (!success || !Array.isArray(data)) {
      throw new Error(error || 'Bad response');
    }

    renderComments(data);
    cOffset += data.length;
  } catch (err) {
    console.error('loadComments error:', err);
    UI.toast(err.message || 'Failed to load comments');
  } finally {
    loadingComments = false;
  }
}

// 2) Render each comment, with vote + delete if owner
export function renderComments(commentsArray) {
  const ul = document.getElementById('comment-list');
  if (!ul) return;

  commentsArray.forEach(c => {
    const li = document.createElement('li');
    li.id = `comment-${c.id}`;
    li.className = 'comment-item';
    li.innerHTML = `
      <div class="comment-header">
        <span class="comment-author">${c.nickname}</span>
        <span class="comment-time">${new Date(c.created_at).toLocaleString()}</span>
      </div>
      <div class="comment-body">
        ${c.content}
      </div>
      <div class="comment-footer">
        <span class="comment-votes">
          <button class="comment-vote-up">⬆️</button>
          <span class="comment-vote-count">${c.votes}</span>
          <button class="comment-vote-down">⬇️</button>
        </span>
        <button class="comment-reply">↩️ Reply</button>
        ${c.user_id === window.currentUserId
          ? `<button class="comment-delete">🗑️ Delete</button>`
          : ''
        }
      </div>
    `;
    ul.appendChild(li);

    // vote handlers
    li.querySelector('.comment-vote-up').addEventListener('click', () => vote(null, c.id, 1));
    li.querySelector('.comment-vote-down').addEventListener('click', () => vote(null, c.id, -1));

    // delete handler
    const delBtn = li.querySelector('.comment-delete');
    if (delBtn) {
      delBtn.addEventListener('click', async () => {
        if (!confirm('Delete this comment?')) return;
        const res = await fetch('/api/comment/delete', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ comment_id: c.id })
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          return UI.toast(json.error || 'Failed to delete comment');
        }
        document.getElementById(`comment-${c.id}`).remove();
        UI.toast('Comment deleted');
      });
    }

    // (reply button handler to come later)
  });
}


// 3) Submission handler stays the same
export function initCommentHandling() {
  document.addEventListener('submit', async e => {
    if (e.target.matches('#comment-form')) {
      e.preventDefault();
      const form = e.target;
      const postID = form.post_id.value;
      const content = form.content.value.trim();

      try {
        const res = await fetch('/api/comment/create', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ post_id: postID, content })
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to post comment');
        }

        form.reset();
        cOffset = 0;
        const ul = document.getElementById('comment-list');
        if (ul) ul.innerHTML = '';
        loadComments(postID);
      } catch (err) {
        console.error('Comment submission error:', err);
        UI.toast(err.message || 'Error posting comment');
      }
    }
  });
}

export function resetCommentOffset() {
  cOffset = 0;
}

export default {
  loadComments,
  renderComments,
  initCommentHandling
};
