const API = '/api';

function getToken() { return localStorage.getItem('token'); }
function setToken(t) { localStorage.setItem('token', t); }
function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}
function setUser(u) { localStorage.setItem('user', JSON.stringify(u)); }

async function api(path, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function navigate(hash) { window.location.hash = hash; }

window.addEventListener('hashchange', render);
window.addEventListener('load', render);

function render() {
  const token = getToken();
  const hash = window.location.hash || '#feed';

  if (!token && !['#login', '#register'].includes(hash)) { navigate('#login'); return; }
  if (token && ['#login', '#register'].includes(hash)) { navigate('#feed'); return; }

  const app = document.getElementById('app');

  if (hash === '#login') app.innerHTML = renderLogin();
  else if (hash === '#register') app.innerHTML = renderRegister();
  else if (hash.startsWith('#profile/')) {
    const userId = hash.split('/')[1];
    app.innerHTML = renderProfilePage(userId);
  } else if (hash === '#explore') app.innerHTML = renderExplore();
  else app.innerHTML = renderFeed();
}

function avatarGradient(username) {
  const gradients = ['avatar-gradient-1', 'avatar-gradient-2', 'avatar-gradient-3', 'avatar-gradient-4'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) { hash = username.charCodeAt(i) + ((hash << 5) - hash); }
  return gradients[Math.abs(hash) % gradients.length];
}

/* ===== AUTH PAGES ===== */

function renderLogin() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="logo">
          <div class="logo-icon">✦</div>
        </div>
        <h1>SocialSphere</h1>
        <p class="subtitle">Connect with the world</p>
        <div id="login-error" class="alert alert-error hidden"></div>
        <form id="login-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="login-username" placeholder="Enter your username" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" placeholder="Enter your password" required>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Log In</button>
        </form>
        <div class="link">Don't have an account? <a href="javascript:void(0)" onclick="navigate('#register')">Sign up</a></div>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="logo">
          <div class="logo-icon">✦</div>
        </div>
        <h1>SocialSphere</h1>
        <p class="subtitle">Create your account</p>
        <div id="register-error" class="alert alert-error hidden"></div>
        <form id="register-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="register-username" placeholder="Choose a username" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="register-email" placeholder="Enter your email" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="register-password" placeholder="Create a password" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Sign Up</button>
        </form>
        <div class="link">Already have an account? <a href="javascript:void(0)" onclick="navigate('#login')">Log in</a></div>
      </div>
    </div>
  `;
}

document.addEventListener('submit', async (e) => {
  if (e.target.id === 'login-form') {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const errorEl = document.getElementById('login-error');
    btn.disabled = true; btn.textContent = 'Logging in...';
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: document.getElementById('login-username').value,
          password: document.getElementById('login-password').value
        })
      });
      setToken(data.token); setUser(data.user); navigate('#feed');
    } catch (err) {
      errorEl.textContent = err.message; errorEl.classList.remove('hidden');
      btn.disabled = false; btn.textContent = 'Log In';
    }
  }

  if (e.target.id === 'register-form') {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const errorEl = document.getElementById('register-error');
    btn.disabled = true; btn.textContent = 'Creating account...';
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: document.getElementById('register-username').value,
          email: document.getElementById('register-email').value,
          password: document.getElementById('register-password').value
        })
      });
      setToken(data.token); setUser(data.user); navigate('#feed');
    } catch (err) {
      errorEl.textContent = err.message; errorEl.classList.remove('hidden');
      btn.disabled = false; btn.textContent = 'Sign Up';
    }
  }
});

/* ===== NAV BAR ===== */

function renderNav() {
  const user = getUser();
  return `
    <nav class="nav">
      <div class="nav-inner">
        <a href="javascript:void(0)" onclick="navigate('#feed')" class="nav-brand">✦ SocialSphere</a>
        <div class="nav-links">
          <a href="javascript:void(0)" onclick="navigate('#feed')" class="${window.location.hash === '#feed' ? 'active' : ''}">Feed</a>
          <a href="javascript:void(0)" onclick="navigate('#explore')" class="${window.location.hash === '#explore' ? 'active' : ''}">Explore</a>
          <a href="javascript:void(0)" onclick="navigate('#profile/${user.id}')" class="${window.location.hash.startsWith('#profile/') ? 'active' : ''}">Profile</a>
          <a href="javascript:void(0)" onclick="logout()" class="logout-link">Logout</a>
        </div>
      </div>
    </nav>
  `;
}

function logout() {
  localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('#login');
}

/* ===== FEED PAGE ===== */

function renderFeed() {
  const user = getUser();
  const gradClass = avatarGradient(user.username);
  const initial = user.username.charAt(0).toUpperCase();
  let html = renderNav();
  html += `
    <div class="container">
      <div class="create-post">
        <div class="create-post-top">
          <div class="create-post-avatar ${gradClass}">${initial}</div>
          <textarea id="post-content" placeholder="What's on your mind, ${user.username}?" rows="2"></textarea>
        </div>
        <div class="create-post-footer">
          <button class="btn btn-primary btn-sm" onclick="createPost()">Post</button>
        </div>
      </div>
      <div id="feed-posts">
        <div class="loading-dots"><span></span><span></span><span></span></div>
      </div>
    </div>
  `;
  setTimeout(() => loadFeed(), 100);
  return html;
}

async function loadFeed() {
  try {
    const posts = await api('/posts/feed');
    const container = document.getElementById('feed-posts');
    if (posts.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><h3>No posts yet</h3><p>Follow users or create your first post!</p></div>';
      return;
    }
    container.innerHTML = posts.map(p => renderPost(p)).join('');
  } catch (err) {
    document.getElementById('feed-posts').innerHTML = `<div class="alert alert-error">${err.message}</div>`;
  }
}

async function createPost() {
  const content = document.getElementById('post-content').value.trim();
  if (!content) return;
  const btn = document.querySelector('.create-post .btn');
  btn.disabled = true; btn.textContent = 'Posting...';
  try {
    await api('/posts', { method: 'POST', body: JSON.stringify({ content }) });
    document.getElementById('post-content').value = '';
    loadFeed();
  } catch (err) { alert(err.message); }
  btn.disabled = false; btn.textContent = 'Post';
}

/* ===== PROFILE PAGE ===== */

function renderProfilePage(userId) {
  let html = renderNav();
  html += `<div class="container" id="profile-container"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
  setTimeout(() => loadProfile(userId), 0);
  return html;
}

async function loadProfile(userId) {
  try {
    const [profile, posts, followStatus] = await Promise.all([
      api(`/users/${userId}`),
      api(`/posts/user/${userId}`),
      userId !== getUser().id ? api(`/follows/status/${userId}`) : Promise.resolve(null)
    ]);

    const me = getUser();
    const gradClass = avatarGradient(profile.username);
    const initial = profile.username.charAt(0).toUpperCase();
    const isMe = me.id === profile.id;
    const isFollowing = followStatus ? followStatus.following : false;

    let html = `
      <div class="glass-card profile-header">
        <div class="profile-avatar ${gradClass}">${initial}</div>
        <h2>${profile.username}</h2>
        <div class="bio">${profile.bio || 'No bio yet'}</div>
        <div class="profile-stats">
          <div class="stat"><div class="num">${profile.postCount}</div><div class="label">Posts</div></div>
          <div class="stat"><div class="num">${profile.followersCount}</div><div class="label">Followers</div></div>
          <div class="stat"><div class="num">${profile.followingCount}</div><div class="label">Following</div></div>
        </div>
        <div class="profile-actions">
          ${isMe
            ? `<button class="btn btn-outline btn-sm" onclick="navigate('#feed')">✏️ Edit Profile</button>`
            : `<button class="btn ${isFollowing ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="toggleFollow(${profile.id}, this)">${isFollowing ? '✓ Following' : '+ Follow'}</button>`}
        </div>
      </div>
      <div id="profile-posts">
        ${posts.length === 0
          ? '<div class="empty-state"><div class="empty-icon">📭</div><h3>No posts yet</h3></div>'
          : posts.map(p => renderPost(p)).join('')}
      </div>
    `;
    document.getElementById('profile-container').innerHTML = html;
  } catch (err) {
    document.getElementById('profile-container').innerHTML = `<div class="alert alert-error">${err.message}</div>`;
  }
}

async function toggleFollow(userId, btn) {
  btn.disabled = true;
  try {
    const data = await api(`/follows/${userId}`, { method: 'POST' });
    btn.textContent = data.following ? '✓ Following' : '+ Follow';
    btn.className = `btn btn-${data.following ? 'outline' : 'primary'} btn-sm`;
    loadProfile(userId);
  } catch (err) { alert(err.message); }
  btn.disabled = false;
}

/* ===== EXPLORE PAGE ===== */

function renderExplore() {
  let html = renderNav();
  html += `
    <div class="container">
      <div class="glass-card" style="padding: 24px;">
        <h3 style="margin-bottom: 16px; font-size: 18px;">🔍 Find People</h3>
        <input type="text" class="user-search" id="search-input" placeholder="Search by username..." oninput="searchUsers()">
        <div id="search-results"></div>
      </div>
    </div>
  `;
  return html;
}

async function searchUsers() {
  const query = document.getElementById('search-input').value.trim();
  const container = document.getElementById('search-results');
  if (!query) { container.innerHTML = ''; return; }
  try {
    const users = await api(`/users/search/${query}`);
    if (users.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding: 24px;"><div class="empty-icon">🔍</div><h3>No users found</h3></div>';
      return;
    }
    const me = getUser();
    container.innerHTML = users
      .filter(u => u.id !== me.id)
      .map(u => {
        const gradClass = avatarGradient(u.username);
        return `
          <div class="user-row">
            <div class="user-avatar ${gradClass}">${u.username.charAt(0).toUpperCase()}</div>
            <div class="user-info">
              <a href="javascript:void(0)" onclick="navigate('#profile/${u.id}')" class="user-name">${escapeHtml(u.username)}</a>
              <div class="user-bio">${u.bio ? escapeHtml(u.bio) : 'No bio yet'}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="navigate('#profile/${u.id}')">View</button>
          </div>
        `;
      }).join('');
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error" style="margin-top:12px">${err.message}</div>`;
  }
}

/* ===== POST RENDERER ===== */

function renderPost(p) {
  const gradClass = avatarGradient(p.username);
  const initial = p.username.charAt(0).toUpperCase();
  const timeAgo = getTimeAgo(p.created_at);
  return `
    <div class="post" data-post-id="${p.id}">
      <div class="post-header">
        <div class="post-avatar ${gradClass}">${initial}</div>
        <div>
          <a href="javascript:void(0)" onclick="navigate('#profile/${p.user_id}')" class="post-author">${escapeHtml(p.username)}</a>
          <div class="post-author-meta">
            <span class="post-time">${timeAgo}</span>
          </div>
        </div>
      </div>
      <div class="post-body">${escapeHtml(p.content)}</div>
      <div class="post-actions">
        <button class="post-action ${p.likedByMe ? 'liked' : ''}" onclick="toggleLike(${p.id}, this)">
          ${p.likedByMe ? '❤️' : '🤍'} <span>${p.likesCount || 0}</span>
        </button>
        <button class="post-action" onclick="toggleComments(${p.id})">
          💬 <span>${p.commentsCount || 0}</span>
        </button>
      </div>
      <div class="comments-section hidden" id="comments-${p.id}">
        <div id="comments-list-${p.id}"></div>
        <div class="comment-form">
          <input type="text" id="comment-input-${p.id}" placeholder="Write a comment..." autocomplete="off">
          <button onclick="addComment(${p.id})">Post</button>
        </div>
      </div>
    </div>
  `;
}

async function toggleLike(postId, btn) {
  try {
    const data = await api(`/likes/post/${postId}`, { method: 'POST' });
    btn.classList.toggle('liked', data.liked);
    const span = btn.querySelector('span');
    let count = parseInt(span.textContent);
    span.textContent = data.liked ? count + 1 : count - 1;
    btn.innerHTML = data.liked ? '❤️' : '🤍';
    btn.innerHTML += ` <span>${span.textContent}</span>`;
  } catch (err) { alert(err.message); }
}

async function toggleComments(postId) {
  const section = document.getElementById(`comments-${postId}`);
  const list = document.getElementById(`comments-list-${postId}`);
  section.classList.toggle('hidden');
  if (!section.classList.contains('hidden') && list.children.length === 0) {
    try {
      const comments = await api(`/comments/post/${postId}`);
      if (comments.length === 0) {
        list.innerHTML = '<div style="color:var(--text-muted);font-size:13px;margin-bottom:12px">No comments yet — be the first!</div>';
        return;
      }
      list.innerHTML = comments.map(c => renderComment(c)).join('');
    } catch (err) { list.innerHTML = `<div class="alert alert-error">${err.message}</div>`; }
  }
}

async function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const content = input.value.trim();
  if (!content) return;
  const btn = input.nextElementSibling;
  btn.disabled = true; btn.textContent = '...';
  try {
    await api('/comments', { method: 'POST', body: JSON.stringify({ post_id: postId, content }) });
    input.value = '';
    const list = document.getElementById(`comments-list-${postId}`);
    const comments = await api(`/comments/post/${postId}`);
    list.innerHTML = comments.map(c => renderComment(c)).join('');
  } catch (err) { alert(err.message); }
  btn.disabled = false; btn.textContent = 'Post';
}

function renderComment(c) {
  const gradClass = avatarGradient(c.username);
  const initial = c.username.charAt(0).toUpperCase();
  return `
    <div class="comment">
      <div class="comment-avatar ${gradClass}">${initial}</div>
      <div class="comment-body">
        <div class="comment-author"><a href="javascript:void(0)" onclick="navigate('#profile/${c.user_id}')">${escapeHtml(c.username)}</a></div>
        <div class="comment-text">${escapeHtml(c.content)}</div>
        <div class="comment-actions">
          <button class="comment-action ${c.likedByMe ? 'liked' : ''}" onclick="toggleCommentLike(${c.id}, this)">
            ${c.likedByMe ? '❤️' : '🤍'} ${c.likesCount || 0}
          </button>
        </div>
      </div>
    </div>
  `;
}

async function toggleCommentLike(commentId, btn) {
  try {
    const data = await api(`/likes/comment/${commentId}`, { method: 'POST' });
    btn.classList.toggle('liked', data.liked);
    const match = btn.textContent.match(/([0-9]+)/);
    let count = match ? parseInt(match[0]) : 0;
    btn.textContent = data.liked ? `❤️ ${count + 1}` : `🤍 ${Math.max(0, count - 1)}`;
  } catch (err) { alert(err.message); }
}

/* ===== HELPERS ===== */

function getTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr + 'Z');
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
