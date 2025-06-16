import { loadUsers } from "./activity.js";
import { initApp } from "./frontend.js";

// forms.js
function setupForm(formId, endpoint, onSuccess, hasFile = false) {
  const form = document.getElementById(formId);
  if (!form) return;
  const picker = document.getElementById("category-picker");

  form.onsubmit = async (e) => {
    e.preventDefault();
    let body;
    if (formId === "create-post-form") {
      // 1) build FormData for title/content/files
      const fd = new FormData(form);
      // 2) remove the old <select name="category">
      fd.delete("category");
      // 3) append every selected pill under the key "category"
      picker
        .querySelectorAll(".category-pill.selected")
        .forEach((pill) => fd.append("category", pill.dataset.id));
      body = fd;
    } else {
      // everything else (login, register, comments…)
      body = hasFile
        ? new FormData(form)
        : new URLSearchParams(new FormData(form));
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers:
          body instanceof FormData
            ? {}
            : { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return window.UI?.toast(data.error || "Something went wrong");
      }
      if (formId === "login-form") {
        location.reload();
      }

      window.UI?.toast(data.data?.message || "Success");
      form.reset();
      window.UI?.hide(form.closest(".popup")?.id);
      if (onSuccess) onSuccess(data.data);
      window.refreshFeed?.();
    } catch (err) {
      window.UI?.toast(err.message);
    }
  };
}

export function initForms() {
  setupForm("register-form", "/api/register");

  // login: after success, set auth _and_ re-fetch “me” so currentUserId is correct,
  // then immediately re-render the feed with delete-buttons visible.
  setupForm("login-form", "/api/login", async () => {
    window.UI.setAuth(true);

    try {
      const meRes = await fetch("/api/me", { credentials: "include" });
      const meJson = await meRes.json();
      if (meJson.success && meJson.data.user?.id) {
        window.currentUserId = meJson.data.user.id;
      }
    } catch (err) {
      console.error("Could not fetch /api/me after login:", err);
      window.currentUserId = null;
    }

    // now that currentUserId is set, re-draw the feed
    window.refreshFeed?.();
  });

  setupForm("create-post-form", "/api/post/create", null, true);
}

document.addEventListener("DOMContentLoaded", initForms);
window.setupForm = setupForm;
