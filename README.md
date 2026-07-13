<div align="center">
  <br/>
  <h1>⚡ CodeAlpha Full-Stack Internship</h1>
  <p><strong>Two complete full-stack applications — an E-Commerce Store &amp; a Social Media Platform</strong></p>
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

## 📋 Overview

This repository contains **two full-stack web applications** built during the **CodeAlpha Full-Stack Internship**. Both projects are built from scratch using **Node.js**, **Express.js**, **SQLite**, and vanilla **HTML/CSS/JS** — with zero external frontend frameworks and no build step.

| Project | Description |
|---------|-------------|
| 🛍️ **ShopHub** | A full-featured e-commerce store with product catalog, cart, orders, and session-based auth |
| ✦ **SocialSphere** | A modern mini social media platform with posts, comments, likes, follows, and JWT auth |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or higher
- **npm** v7 or higher

### Quick Start

<details>
<summary><strong>🛍️ E-Commerce Store (ShopHub)</strong></summary>

```bash
cd E-Commerce-Store
npm install
npm run seed    # (Optional) Insert 12 sample products
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** — the database is created automatically on first run.

</details>

<details>
<summary><strong>✦ Social Media Platform (SocialSphere)</strong></summary>

```bash
cd Social-Media-Platform
npm install
node seed.js    # Seed demo users & content
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** — database is created automatically.

</details>

---

## 🛍️ ShopHub — E-Commerce Store

A complete online shopping experience with product browsing, cart management, and order processing.

### Key Features
| Feature | Details |
|---------|---------|
| 🔐 **Authentication** | Secure register/login with bcrypt + session-based auth |
| 📦 **Product Catalog** | Grid view with real-time search & category filtering |
| 🛒 **Shopping Cart** | Server-side cart with stock validation & quantity controls |
| 📋 **Orders** | Transactional checkout, order history with status badges |
| 📱 **Responsive UI** | Dark purple/gold theme, CSS Grid, mobile-friendly |

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Express.js, better-sqlite3, bcryptjs, express-session |
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Database | SQLite with WAL mode & foreign keys |

### API Endpoints
| Group | Endpoints |
|-------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Products | `GET /api/products`, `GET /api/products/categories`, `GET /api/products/:id` |
| Cart | `GET /api/cart`, `POST /api/cart/add`, `PUT /api/cart/update/:id`, `DELETE /api/cart/remove/:id`, `DELETE /api/cart/clear` |
| Orders | `POST /api/orders/checkout`, `GET /api/orders`, `GET /api/orders/:id` |

### Seed Products
Wireless Headphones ($79.99), Running Shoes ($129.99), Leather Backpack ($89.99), Smart Watch ($199.99), Cotton T-Shirt ($24.99), Bluetooth Speaker ($49.99), Coffee Maker ($64.99), Yoga Mat ($34.99), Sunglasses ($59.99), Mechanical Keyboard ($119.99), Denim Jacket ($74.99), Stainless Water Bottle ($29.99)

---

## ✦ SocialSphere — Social Media Platform

A modern social networking app inspired by platforms like Twitter/X, with a glassmorphism dark UI.

### Key Features
| Feature | Details |
|---------|---------|
| 👤 **User Profiles** | Bio, dynamic gradient avatars, stats (posts/followers/following) |
| 📝 **Posts & Comments** | Create posts, comment with expandable threads |
| ❤️ **Likes** | Like/unlike posts and comments with animated hearts |
| 🔄 **Follow System** | Follow/unfollow, personalized feed from followed users |
| 🎨 **Glassmorphism UI** | Dark theme with backdrop blur, floating gradients, smooth animations |

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Express.js, better-sqlite3, bcryptjs, jsonwebtoken |
| Frontend | Vanilla JS SPA with hash-based routing, CSS glassmorphism |
| Database | SQLite with WAL mode & 5 tables (users, posts, comments, likes, follows) |

### API Endpoints
| Group | Endpoints |
|-------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Users | `GET /api/users/:id`, `GET /api/users/profile`, `PUT /api/users/profile`, `GET /api/users/search/:query` |
| Posts | `GET /api/posts`, `GET /api/posts/feed`, `GET /api/posts/user/:userId`, `POST /api/posts`, `DELETE /api/posts/:id` |
| Comments | `GET /api/comments/post/:postId`, `POST /api/comments`, `DELETE /api/comments/:id` |
| Likes | `POST /api/likes/post/:postId`, `POST /api/likes/comment/:commentId` |
| Follows | `POST /api/follows/:userId`, `GET /api/follows/status/:userId`, `GET /api/follows/followers/:userId`, `GET /api/follows/following/:userId` |

### Demo Accounts
| Username | Password |
|----------|----------|
| `alice` | `password123` |
| `bob` | `password123` |
| `charlie` | `password123` |
| `diana` | `password123` |
| `eve` | `password123` |

---

## 🏗️ Architecture

Both projects follow a **monolithic MVC-like architecture** with a clear separation of concerns:

```
project-root/
├── server.js           # Express entry point (routes, middleware, static files)
├── db.js               # Database schema & initialization
├── seed.js             # Demo data seeder
├── middleware/         # Auth middleware (session/JWT)
├── routes/             # Route handlers organized by resource
├── public/             # Static frontend files
│   ├── index.html      # Entry page
│   ├── js/             # Client-side JavaScript
│   └── css/            # Stylesheets
└── *.db                # SQLite database (auto-generated)
```

### Common Patterns
- **RESTful API design** with JSON responses
- **Server-side rendered** static HTML + client-side fetch for dynamic content
- **Zero build step** — no bundlers, transpilers, or frameworks
- **SQLite** with WAL journaling mode and foreign key enforcement
- **Bcrypt** password hashing for security

---

## 🧰 Tech Stack Comparison

| Aspect | 🛍️ ShopHub | ✦ SocialSphere |
|--------|-----------|----------------|
| **Auth Strategy** | Session-based (express-session) | Token-based (JWT) |
| **Frontend Architecture** | Multi-page (separate HTML files) | Single-page (hash-based router) |
| **Database Tables** | 5 (users, products, cart_items, orders, order_items) | 5 (users, posts, comments, likes, follows) |
| **CSS Theme** | Dark purple & gold | Dark glassmorphism with gradients |
| **Unique Feature** | Transactional checkout with stock management | Real-time like/follow toggles |
| **File Uploads** | N/A | Multer configured (future use) |

---

## 📜 Available Scripts

| Project | Command | Description |
|---------|---------|-------------|
| **Both** | `npm start` | Start server on port 3000 |
| **E-Commerce** | `npm run seed` | Insert 12 sample products (idempotent) |
| **Social** | `node seed.js` | Seed 5 demo users + content |
| **Social** | `npx nodemon server.js` | Dev mode with auto-reload |

---

## 🚢 Deployment Notes

- Set `PORT` environment variable to change the listen port (default: 3000)
- SocialSphere requires `JWT_SECRET` env var in production (falls back to a hardcoded dev secret otherwise)
- Use a process manager like **PM2** for production:
  ```bash
  npm install -g pm2
  pm2 start server.js
  ```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<br/>
<div align="center">
  <sub>Built with ❤️ as a <a href="https://codealpha.tech/">CodeAlpha</a> Full-Stack Internship project.</sub>
  <br/>
  <sub>© 2024 — All Rights Reserved</sub>
</div>
<br/>
