function showAlert(message, type = 'success') {
  const alertEl = document.getElementById('alert');
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = `alert alert-${type}`;
  alertEl.style.display = 'block';
  setTimeout(() => { alertEl.style.display = 'none'; }, 4000);
}

async function updateCartCount() {
  try {
    const res = await fetch('/api/cart');
    if (res.ok) {
      const data = await res.json();
      const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
      const el = document.getElementById('cartCount');
      if (el) el.textContent = count;
    }
  } catch {}
}

async function updateAuthUI() {
  try {
    const res = await fetch('/api/auth/me');
    const user = await res.json();
    const el = document.getElementById('authButtons');
    if (!el) return;
    if (user) {
      el.innerHTML = `
        <span class="greeting">Hi, ${user.username}</span>
        <button class="logout-btn" onclick="logout()">Logout</button>
      `;
    } else {
      el.innerHTML = `
        <a href="/login.html" class="btn-outline">Login</a>
        <a href="/register.html" class="btn-primary">Register</a>
      `;
    }
  } catch {}
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  updateCartCount();
});
