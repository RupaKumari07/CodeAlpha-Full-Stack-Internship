<div align="center">
  <br/>
  <h1>🛍️ ShopHub</h1>
  <p><strong>A full-featured e-commerce store built with Node.js, Express & SQLite</strong></p>
  <br/>
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
    <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  </p>
  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
  </p>
  <br/>
</div>

---

## ✨ Features

- **🔐 User Authentication** — Secure registration & login with session-based auth (bcryptjs + express-session)
- **📦 Product Catalog** — Browse products with real-time search and category filtering
- **🛒 Shopping Cart** — Add, update quantity, and remove items with stock validation
- **📋 Order Management** — Transactional checkout with automatic stock deduction
- **📱 Responsive Design** — Fully responsive UI with mobile breakpoints at 968px & 640px
- **⚡ Zero Build Step** — Plain HTML/CSS/JS served directly by Express; no bundler required

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or later
- **npm** v7 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ecommerce-store.git
cd ecommerce-store

# Install dependencies
npm install

# (Optional) Seed the database with 12 sample products
npm run seed

# Start the server
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> The database (`store.db`) and all tables are **created automatically** on first run. Seeding is idempotent — safe to run multiple times.

---

## 🗺️ Project Structure

```
ecommerce-store/
├── server.js              # Express app entry point
├── db.js                  # Database initialization & schema
├── seed.js                # Sample product seeder
├── package.json
├── middleware/
│   └── auth.js            # requireAuth middleware
├── routes/
│   ├── auth.js            # Register, login, logout, session
│   ├── products.js        # Product listing, search, filter
│   ├── cart.js            # Cart CRUD operations
│   └── orders.js          # Checkout & order history
├── public/
│   ├── index.html         # Homepage — hero, search, product grid
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── cart.html          # Shopping cart
│   ├── orders.html        # Order history
│   ├── product.html       # Product detail page
│   ├── css/
│   │   └── style.css      # Complete custom stylesheet
│   └── js/
│       ├── main.js        # Shared UI helpers
│       ├── products.js    # Product rendering & filtering
│       └── cart.js        # Cart logic
└── store.db               # SQLite database (auto-generated)
```

---

## 🗄️ Database Schema

| Table | Key Columns |
|-------|-------------|
| **users** | `id`, `username` (unique), `email` (unique), `password` (bcrypt), `created_at` |
| **products** | `id`, `name`, `description`, `price`, `image_url`, `category`, `stock`, `created_at` |
| **cart_items** | `id`, `user_id` ↦ users, `product_id` ↦ products, `quantity` |
| **orders** | `id`, `user_id` ↦ users, `total`, `status` (pending/confirmed/shipped/delivered), `created_at` |
| **order_items** | `id`, `order_id` ↦ orders, `product_id` ↦ products, `quantity`, `price` |

> Foreign keys are enabled with `ON DELETE CASCADE`. The cart enforces a `UNIQUE(user_id, product_id)` constraint.

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account (username, email, password) |
| POST | `/api/auth/login` | — | Sign in (username, password) |
| POST | `/api/auth/logout` | — | End session |
| GET | `/api/auth/me` | — | Get current user or `null` |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | — | List all products (`?category=X&search=Y`) |
| GET | `/api/products/categories` | — | List distinct categories |
| GET | `/api/products/:id` | — | Get single product |

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | ✅ | Get cart items with totals |
| POST | `/api/cart/add` | ✅ | Add item `{ product_id, quantity }` |
| PUT | `/api/cart/update/:id` | ✅ | Update quantity (deletes if ≤ 0) |
| DELETE | `/api/cart/remove/:id` | ✅ | Remove item |
| DELETE | `/api/cart/clear` | ✅ | Clear entire cart |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/checkout` | ✅ | Convert cart → order (transactional) |
| GET | `/api/orders` | ✅ | List user's orders |
| GET | `/api/orders/:id` | ✅ | Get order details with line items |

---

## 🎨 Frontend Pages

| URL | Page | Features |
|-----|------|----------|
| `/` | **Homepage** | Hero banner, search bar, category filter, product grid with cards |
| `/login.html` | **Login** | Username & password form |
| `/register.html` | **Register** | Username, email & password form |
| `/cart.html` | **Cart** | Item list with quantity controls, remove, checkout button |
| `/orders.html` | **Orders** | Order history with status badges (pending/confirmed/shipped/delivered) |
| `/product.html?id=N` | **Product Detail** | Full product info, quantity selector, add to cart |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Backend** | Express.js |
| **Database** | SQLite via better-sqlite3 |
| **Auth** | bcryptjs + express-session |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Fonts** | Google Fonts — Inter |
| **Styling** | Custom CSS (Grid, Flexbox, CSS Variables) |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Launch the server on `http://localhost:3000` |
| `npm run seed` | Insert 12 sample products (idempotent) |

> The server respects the `PORT` environment variable if set.

---

<br/>
<div align="center">
  <sub>Built with ❤️ as a <a href="https://codealpha.tech/">CodeAlpha</a> Full-Stack Internship project.</sub>
</div>
<br/>
