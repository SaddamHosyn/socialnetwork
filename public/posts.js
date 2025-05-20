// posts.js
import { UI } from './ui.js';

const categoryIcons = {
  'Aland': '🏝️',
  'Animals': '🐾',
  'Anime': '🌸',
  'Art': '🎨',
  'Books': '📚',
  'Celebrities': '⭐',
  'Cooking': '👩‍🍳',
  'Creepy': '👻',
  'Dreams': '💭',
  'Fashion': '👗',
  'Food': '🍔',
  'Funny': '😂',
  'Gaming': '🎮',
  'Gym': '🏋️‍♂️',
  'History': '🏰',
  'Horoscopes': '🔭',
  'Love': '❤️',
  'Money': '💰',
  'Movies': '🎬',
  'Music': '🎵',
  'Politics': '🏛️',
  'Relationships': '💑',
  'Rich People': '🤑',
  'Shower Thoughts': '🚿',
  'Sports': '🏅',
  'Travel': '✈️',
  'Weird': '🤪',
};

export let currentCategory = null;
export let offset = 0;
export const limit = 20;

// 1) Load and render the sidebar + <select> categories
export async function loadCategories() {
  try {
    const res = await fetch('/api/categories', { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);

    const cats = json.data;

    // sidebar categories
    const ul = document.getElementById('category-list');
    ul.querySelectorAll('.dynamic-category').forEach(el => el.remove());
    cats.forEach(c => {
      const li = document.createElement('li');
      const icon = categoryIcons[c.name] || '';
      li.className = 'category-item dynamic-category';
      li.dataset.categoryId = c.id;
      li.innerHTML = `<a href="#" data-category-id="${c.id}">${icon} ${c.name}</a>`;
      ul.appendChild(li);
    });
  
// Create-post category picker (pills)
const picker = document.getElementById('category-picker');
if (picker) {
  picker.innerHTML = '';
  cats.forEach(c => {
    const pill = document.createElement('div');
    pill.className = 'category-pill';
    pill.textContent = `${categoryIcons[c.name] || ''} ${c.name}`;
    pill.dataset.id = c.id;
    picker.append(pill);

    pill.addEventListener('click', () => {
      if (pill.classList.contains('disabled')) return;
      pill.classList.toggle('selected');
      updatePickerState();
    });
  });

  function updatePickerState() {
    const all = [...picker.children];
    const selCount = all.filter(p => p.classList.contains('selected')).length;
    all.forEach(p => {
      if (!p.classList.contains('selected')) {
        p.classList.toggle('disabled', selCount >= 3);
      }
    });
  }
}
} catch (err) {
console.error('Failed to load categories:', err);
UI.toast('Could not load categories', 3000, 'center');
}
}

// 2) Hook up sidebar clicks to filter
export function initCategoryHandling() {
  loadCategories();
  document
    .getElementById('category-list')
    .addEventListener('click', e => {
      const li = e.target.closest('li.category-item');
      if (!li) return;
      const id = li.dataset.categoryId;
      currentCategory = id === 'all' ? null : +id;
      offset = 0;
      document
        .querySelectorAll('#category-list .category-item')
        .forEach(x => x.classList.remove('active'));
      li.classList.add('active');
      loadPosts();
    });
}

// 3) Fetch & render feed
export async function loadPosts() {
  try {
    const q = new URLSearchParams({
      limit,
      offset,
      ...(currentCategory !== null && { category_id: currentCategory }),
    });
    const res = await fetch(`/api/posts?${q.toString()}`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    if (!Array.isArray(json.data)) throw new Error('Invalid posts data');

    renderPosts(json.data);
    offset += json.data.length;
    return true;
  } catch (err) {
    console.error('loadPosts error:', err);
    UI.toast('Could not load posts');
    renderPosts([]);
  }
}

export function renderPosts(posts) {
  const feed = document.getElementById('post-feed');
  if (!feed) return;
  feed.innerHTML = '';
  if (!Array.isArray(posts)) return;

  posts.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post';
    div.dataset.id = p.id;
    div.innerHTML = `
  <div class="post-meta">
    <span class="author">${p.nickname}</span>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span class="datetime">${new Date(p.created_at).toLocaleString()}</span>
      ${p.user_id === window.currentUserId ? '<button class="delete-post">🗑️</button>' : ''}
    </div>
  </div>
      <h3 class="post-title">${p.title}</h3>
      <p class="post-content">${p.content}</p>
      <div class="post-tags">
        ${p.categories.map(c => `<span class="tag">${c}</span>`).join(' ')}
      </div>
      <div class="post-actions">
        <button class="vote up ${p.user_vote===1?'voted':''}">⬆️</button>
        <span>${p.votes}</span>
        <button class="vote down ${p.user_vote===-1?'voted':''}">⬇️</button>
        <button class="comment-btn">💬</button>
      </div>
    `;

    // Add delete functionality if user owns the post
    if (p.user_id === window.currentUserId) {
      const deleteBtn = div.querySelector('.delete-post');
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this post?")) {
          try {
            const formData = new FormData();
            formData.append('post_id', p.id);
            
            const res = await fetch('/api/post/delete', {
              method: 'POST',
              credentials: 'include',
              body: formData
            });
            
            if (!res.ok) throw new Error('Delete failed');
            window.refreshFeed();
            UI.toast('Post deleted successfully');
          } catch (err) {
            console.error('Delete error:', err);
            UI.toast(err.message || 'Failed to delete post');
          }
        }
      });
    }

    // Insert carousel or fallback
    if (Array.isArray(p.image_paths) && p.image_paths.length) {
      const paths = p.image_paths.map(s => s.replace('./uploads/','/uploads/'));
      div.insertBefore(makeCarousel(paths), div.querySelector('.post-tags'));
    } else if (p.image_path) {
      const img = document.createElement('img');
      img.src = p.image_path.replace('./uploads/','/uploads/');
      img.className = 'max-w-full rounded my-2';
      div.insertBefore(img, div.querySelector('.post-tags'));
    }

    // Attach event listeners to stop propagation
    const upBtn = div.querySelector('.vote.up');
    upBtn.addEventListener('click', e => {
      e.stopPropagation();
      vote(p.id, null, 1);
    });
    const downBtn = div.querySelector('.vote.down');
    downBtn.addEventListener('click', e => {
      e.stopPropagation();
      vote(p.id, null, -1);
    });
    div.addEventListener('click', (e) => {
      // Check if clicked element is NOT a vote button or comment button
      const isVoteButton = e.target.closest('.vote');
      const isCommentButton = e.target.closest('.comment-btn');
      
      if (!isVoteButton && !isCommentButton) {
        singlePost(p.id);
      }
    });
    const commentBtn = div.querySelector('.comment-btn');
    commentBtn.addEventListener('click', e => {
      e.stopPropagation();
      singlePost(p.id);
    });

    feed.appendChild(div);
  });
}

export function refreshFeed() {
  const feed = document.getElementById('post-feed');
  feed.innerHTML = ''; // Clear existing posts
  offset = 0;
  window.loadUsers?.();
  return loadPosts(); // Return promise chain
}

// 4) Single-post view
export async function singlePost(postId) {
  try {
    window.currentPostId = postId;
    const res = await fetch(`/api/post?id=${postId}`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    const { post } = json.data;

    // *** Add this check: Ensure user_id is present ***
    if (post.user_id === undefined) {
        console.error("Post data fetched for single view is missing user_id.");
        // Optionally, show a generic error or proceed without delete functionality
    }


    UI.hideAll();
    UI.show('single-post-container');
    const c = document.getElementById('single-post-container');

    // Determine if the delete button should be shown
    // Use the fix you found: comparing with window.currentUserId
    const showDeleteButton = post.user_id === window.currentUserId;


    // build the wrapper + content
    c.innerHTML = `
      <div class="form-wrapper">
        <div class="single-content">
          <h3 class="post-title">${post.title}</h3>
          <p class="post-content">${post.content}</p>
          <div id="carousel-container"></div>
          <div class="post-tags">
            ${post.categories.map(cat =>
              `<span class="category-pill selected">
                 ${categoryIcons[cat] || ''} ${cat}
               </span>`
            ).join('')}
          </div>

          <div class="post-vote-strip">
            <button id="single-vote-up" class="vote">⬆️</button>
            <span id="single-post-vote-count">${post.votes}</span>
            <button id="single-vote-down"
            <button id="single-vote-up" class="vote">⬇️</button>
          </div>

          <h3>Comments:</h3>
          <form id="comment-form">
            <input type="hidden" name="post_id" value="${postId}">
            <textarea name="content" placeholder="Write a comment…" required></textarea>
            <button type="submit">Post Comment</button>
          </form>
          <ul id="comment-list"></ul>
        </div>
        <div class="button-group">
          ${showDeleteButton ? '<button id="delete-single-post" class="delete-button">🗑️ Delete Post</button>' : ''}
          <button id="close-single-post">Close</button>
        </div>
      </div>
    `;

    // --- Attach event listeners ---

    const commentList = document.getElementById('comment-list');
    const savePos = () => commentList.scrollTop;
    const restorePos = pos => commentList.scrollTop = pos;

    document.getElementById('single-vote-up').onclick = () => {
      const pos = savePos();
      vote(postId, null, 1);
      restorePos(pos);
    };
    document.getElementById('single-vote-down').onclick = () => {
      const pos = savePos();
      vote(postId, null, -1);
      restorePos(pos);
    };

    // *** Add event listener for the new delete button (if it exists) ***
    const deleteBtn = document.getElementById('delete-single-post');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
          try {
            const formData = new FormData();
            formData.append('post_id', postId);

            const deleteRes = await fetch('/api/post/delete', {
              method: 'POST',
              credentials: 'include',
              body: formData
            });

            if (!deleteRes.ok) {
               const errData = await deleteRes.json().catch(() => ({ error: 'Delete failed with status ' + deleteRes.status }));
               throw new Error(errData.error || 'Delete failed');
            }

            UI.hide('single-post-container'); // Hide the popup
            UI.toast('Post deleted successfully'); // Show confirmation
            window.currentPostId = null; // Reset current post ID
            window.refreshFeed(); // Refresh the main feed

          } catch (err) {
            console.error('Delete error (single post view):', err);
            UI.toast(err.message || 'Failed to delete post');
          }
        }
      });
    }


    // insert the real carousel
    const imagePaths = (post.image_paths || []).concat(post.image_path||[]);
    if (imagePaths.length) {
      const carouselEl = makeCarousel(
        imagePaths.map(p => p.replace('./uploads/','/uploads/'))
      );
      document.getElementById('carousel-container')
              .appendChild(carouselEl);
    }

    // init comments
    document.getElementById('comment-list').innerHTML = '';
    window.resetCommentOffset?.();
    window.loadComments?.(postId);

    // close handler
    document.getElementById('close-single-post').onclick = () => {
      const feed = document.getElementById('post-feed');
      const scrollPos = feed.scrollTop;
      UI.hide('single-post-container');
      window.currentPostId = null;
      // Restore scroll position using requestAnimationFrame for reliability
      requestAnimationFrame(() => feed.scrollTop = scrollPos);
    };

  } catch (err) {
    console.error('singlePost error:', err);
    UI.toast('Couldn’t load post', 3000, 'center');
    // Optionally hide the container if loading fails completely
     UI.hide('single-post-container');
     window.currentPostId = null;
  }
}

function makeCarousel(imgPaths) {
  let idx = 0;
  const c = document.createElement('div');
  c.className = 'image-carousel';
  const img = document.createElement('img');
  img.className = 'carousel-img';
  img.src = imgPaths[0];
  c.append(img);

  if (imgPaths.length > 1) {
  ['←','→'].forEach((sym, i) => {
    const btn = document.createElement('button');
    btn.textContent = sym;
    btn.className = i === 0 ? 'carousel-prev' : 'carousel-next';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      idx = (idx + (i === 0 ? -1 : 1) + imgPaths.length) % imgPaths.length;
      img.src = imgPaths[idx];
    });
    c.append(btn);
  });
  }
  return c;
}

window.refreshFeed = refreshFeed;
export { makeCarousel }; { makeCarousel }