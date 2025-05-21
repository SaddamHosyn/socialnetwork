// frontend.js
import { UI } from './ui.js';
import { initActivityTracking, loadUsers } from './activity.js';
import { initForms } from './forms.js';
import {
  initCategoryHandling,
  refreshFeed,
  loadPosts,
  singlePost,
} from './posts.js';
import {
  loadComments,
  renderComments,
  initCommentHandling,
  resetCommentOffset,
} from './comments.js';
import { vote } from './votes.js';
import { userProfile } from './profile.js';

window.loadComments = loadComments;
window.renderComments = renderComments;
window.resetCommentOffset = resetCommentOffset;
window.vote = vote;
window.singlePost = singlePost;
window.userProfile = userProfile;
window.loadUsers = loadUsers;

export async function initApp() {
  initActivityTracking();
  initForms();
  initCategoryHandling();
  initCommentHandling();

  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    const j = await res.json();
    UI.setAuth(j.success);

    // **correct** path into the payload:
    if (j.success && j.data?.user?.id) {
      window.currentUserId = j.data.user.id;
    } else {
      window.currentUserId = null;
    }
  } catch (err) {
    console.error('Me fetch failed:', err);
    UI.setAuth(false);
    window.currentUserId = null;
  }

  // only now do we render the feed
  await refreshFeed();
  updateWebsocket(true);
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const chatId = params.get('chatId')
  if (!chatId) {
    const isLogged = await checkLogin();
    if (isLogged) {
      initApp();
    } else {
      document.querySelector('main').classList.add('hidden');
      document.querySelector('#info-container').classList.remove('hidden');
    }
  }
});

export async function checkLogin() {
  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    if (res.ok) {
      const j = await res.json();
      UI.setAuth(j.success);

      // **correct** path into the payload:
      if (j.success && j.data?.user?.id) {
        window.currentUserId = j.data.user.id;
        console.log('User checked: logged in')
        return true;
      } else {
        window.currentUserId = null;
        console.log('User checked: NOT logged in')
        return false;
      }
    } else {
      return false
    }

  } catch (err) {
    console.error('Me fetch failed:', err);
    UI.setAuth(false);
    window.currentUserId = null;
    return false;
  }

}


function updateWebsocket(status) {
  if (status === true) {
    window.ws = new WebSocket('ws://localhost:8080/ws?type=update');
    console.log("update ws opened")

    window.ws.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'update':
        //  console.log("Update message received (frontend.js");
          loadUsers();
          break;

          case 'message':
            if (data.sender_id !== window.currentUserId) {
              UI.toast('New message from ' + data.sender_name, 5000, 'center');
            }
            break;
      }
    });
  } else {
    window.ws.close();
    console.log("update ws clodsed")
  }
}

