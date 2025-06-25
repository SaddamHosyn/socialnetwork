// votes.js
export function vote(postId, commentId, voteType) {
    const data = new URLSearchParams();
    if (postId) data.append("post_id", postId);
    if (commentId) data.append("comment_id", commentId);
    data.append("vote", voteType);

    fetch("/api/vote", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
    })
    .then(res => {
        if (!res.ok) throw new Error("Vote failed");
        return res.json();
    })
    .then(data => {
        if (!commentId) {
            const feed = document.getElementById('post-feed');
            const scrollPos = feed.scrollTop;
            window.refreshFeed?.().then(() => {
                feed.scrollTop = scrollPos;
            });
        }
        if (window.currentPostId) {
            window.singlePost(window.currentPostId);
        }
    })
    .catch(err => {
        console.error("Vote error:", err);
        window.UI?.toast(err.message || "Failed to vote");
    });
}