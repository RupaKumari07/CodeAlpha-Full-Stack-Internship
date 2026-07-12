let allProducts = [];

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    allProducts = await res.json();
    const countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = allProducts.length;
    renderProducts(allProducts);
    loadCategories();
  } catch {
    document.getElementById('loading').style.display = 'none';
    showAlert('Failed to load products', 'error');
  }
}

async function loadCategories() {
  try {
    const res = await fetch('/api/products/categories');
    const categories = await res.json();
    const select = document.getElementById('categoryFilter');
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    });
  } catch {}
}

function renderProducts(products) {
  document.getElementById('loading').style.display = 'none';
  const grid = document.getElementById('productGrid');
  if (products.length === 0) {
    grid.innerHTML = '<p style="text-align:center;padding:3rem;color:#888;">No products found.</p>';
    return;
  }
  grid.innerHTML = products.map(p => {
    const stockClass = p.stock <= 0 ? 'out' : p.stock <= 5 ? 'low' : 'in';
    const stockText = p.stock <= 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock';
    return `
      <div class="product-card">
        <a href="/product.html?id=${p.id}" class="img-wrap">
          <img src="${p.image_url}" alt="${p.name}" loading="lazy">
          <span class="badge">${p.category}</span>
        </a>
        <div class="info">
          <h3><a href="/product.html?id=${p.id}">${p.name}</a></h3>
          <div class="desc">${p.description}</div>
          <div class="price">$${p.price.toFixed(2)}</div>
          <div class="bottom">
            <span class="stock ${stockClass}">${stockText}</span>
            <button onclick="quickAdd(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
              ${p.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function quickAdd(productId) {
  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    });
    const data = await res.json();
    if (res.ok) {
      showAlert('✓ Added to cart!', 'success');
      updateCartCount();
    } else if (res.status === 401) {
      window.location.href = '/login.html';
    } else {
      showAlert(data.error || 'Failed to add', 'error');
    }
  } catch {
    showAlert('Error adding to cart', 'error');
  }
}

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
if (searchInput) searchInput.addEventListener('input', filterProducts);
if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);

function filterProducts() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  let filtered = allProducts;
  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }
  if (category) filtered = filtered.filter(p => p.category === category);
  renderProducts(filtered);
}

document.addEventListener('DOMContentLoaded', loadProducts);
