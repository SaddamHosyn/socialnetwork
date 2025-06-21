import { checkLogin } from './frontend.js';

// ui.js
const UI = {
  toggle(id, show) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle('hidden', !show);
    }
  },
  show(id) {
    this.toggle(id, true);
  },
  hide(id) {
    this.toggle(id, false);
  },
  toast(message, duration = 3000, position = "bottom") {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden', 'center');
    if (position === 'center') toast.classList.add('center');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('center');
      }, 300);
    }, duration);
  },
  setAuth(loggedIn) {
    this.toggle('btn-register', !loggedIn);
    this.toggle('btn-login', !loggedIn);
    this.toggle('btn-profile', loggedIn);
    this.toggle('btn-logout', loggedIn);

  },
  hideAll() {
    [
      'login-container',
      'register-container',
      'create-post-container',
      'single-post-container',
      'profile-container',
      'info-container'
    ].forEach(this.hide.bind(this));
  },

  /**
   * Clear any draft data in the Create-Post form (title, content, files, categories)
   */
  resetCreatePostDraft() {
    const form = document.getElementById('create-post-form');
    if (!form) return;
    // Reset inputs and textarea
    form.reset();
    // Clear category pills
    document
      .querySelectorAll('#category-picker .category-pill')
      .forEach(pill => pill.classList.remove('selected', 'disabled'));
  }
};



function initUIBindings() {
  // Register button
  document.getElementById('btn-register')?.addEventListener('click', () => {
    UI.hideAll();
    UI.show('register-container');
  });
  // Login button
  document.getElementById('btn-login')?.addEventListener('click', () => {
    UI.hideAll();
    UI.show('login-container');
  });
  // Logout button
  document.getElementById('btn-logout')?.addEventListener('click', handleLogout);
  // Profile button
  document.getElementById('btn-profile')?.addEventListener('click', handleProfile);
  // Create Post button
  document.getElementById('btn-create-post')?.addEventListener('click', handleCreatePost);

  // Close buttons mapping
  const closeButtons = [
    { id: 'cancel-register', target: 'register-container' },
    { id: 'cancel-login', target: 'login-container' },
    { id: 'cancel-create-post', target: 'create-post-container' },
    { id: 'close-profile', target: 'profile-container' },
    { id: 'close-post', target: 'single-post-container' }
  ];
  closeButtons.forEach(({ id, target }) => {
    document.getElementById(id)?.addEventListener('click', () => {
      UI.hide(target);
      // restore scroll for profile
      if (id === 'close-profile' && window.profileScrollPosition) {
        const feed = document.getElementById('post-feed');
        requestAnimationFrame(() => {
          feed.scrollTop = window.profileScrollPosition;
          window.profileScrollPosition = null;
        });
      }
    });
  });

  // Post feed click handler for comments
  document.getElementById('post-feed')?.addEventListener('click', e => {
    const btn = e.target.closest('.comment-btn');
    if (!btn) return;
    const postDiv = btn.closest('.post');
    if (postDiv) {
      UI.hideAll();
      window.singlePost(postDiv.dataset.id);
    }
  });

  // ESC key to close all
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!document.getElementById('single-post-container').classList.contains('hidden')) {
        window.currentPostId = null;
      }
      UI.hideAll();
    }
  });
}

// Logout handler
function handleLogout() {
  fetch('/api/logout', { method: 'POST', credentials: 'include' })
    .then(r => r.json())
    .then(json => {
      if (!json.success) throw new Error(json.error);
      UI.setAuth(false);
      window.currentUserId = null;
      UI.toast('Logged out');
      // clear draft only on logout
      UI.resetCreatePostDraft();
      window.refreshFeed?.();
      location.reload();
    })
    .catch(() => UI.toast('Logout failed'));
}

// Profile handler
function handleProfile() {
  UI.hideAll();
  fetch('/api/profile', { credentials: 'include' })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        const data = res.data;
        // ensure posts/comments exist so userProfile won't crash
        data.posts = Array.isArray(data.posts) ? data.posts : [];
        data.comments = Array.isArray(data.comments) ? data.comments : [];
        window.userProfile?.(data);
      } else {
        UI.toast(res.error || 'Failed to load profile');
      }
    })
    .catch(err => {
      console.error('Profile fetch error:', err);
      UI.toast('Failed to load profile');
    });
}

// Create-post handler (no draft reset here!)
function handleCreatePost() {
  if (!window.isLoggedIn?.()) {
    UI.toast('Please log in to create a post.');
    return;
  }
  UI.hideAll();
  UI.show('create-post-container');
}

document.addEventListener('DOMContentLoaded', initUIBindings);
window.UI = UI;

function isLoggedIn() {
  //return !document.getElementById('btn-logout').classList.contains('hidden');
  // To be changed in order not to make multiple functions
  return checkLogin();
}
window.isLoggedIn = isLoggedIn;
export { isLoggedIn, UI };
