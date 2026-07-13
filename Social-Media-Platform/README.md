# ✦ SocialSphere

> A modern mini social media platform built with **Express.js** and vanilla **HTML/CSS/JS** — featuring a sleek dark-glass UI, real-time interactions, and a complete social feature set.

![Version](https://img.shields.io/badge/version-1.0.0-6c5ce7?style=flat-square)
![Node](https://img.shields.io/badge/node-%3E%3D18-00cec9?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-fdcb6e?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-welcome-fd79a8?style=flat-square)

---

## ✨ Features

### 👤 User Profiles
- Create accounts with username/email/password
- Bio, profile avatars with dynamic gradient colors
- View profile stats: posts, followers, following

### 📝 Posts & Comments
- Share text updates with your followers
- Comment on any post in real-time
- Expandable comment threads per post

### ❤️ Like / Follow System
- Like/unlike posts and comments with animated hearts
- Follow/unfollow other users
- Personalized feed showing posts from followed users

### 🎨 Modern UI
- Dark glassmorphism design with floating gradients
- Smooth animations and hover effects
- Fully responsive — works on mobile and desktop
- Loading states and intuitive navigation

---

## 🖼️ Screenshots

| Auth | Feed | Profile |
|------|------|---------|
| ![](https://placehold.co/300x450/1a1a2e/a29bfe?text=Login&font=inter) | ![](https://placehold.co/300x450/1a1a2e/a29bfe?text=Feed&font=inter) | ![](https://placehold.co/300x450/1a1a2e/a29bfe?text=Profile&font=inter) |

> *Replace placeholder images above with actual screenshots of your running app.*

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/social-media-platform.git
cd social-media-platform

# Install dependencies
npm install

# Seed the database with demo data
node seed.js

# Start the server
npm start
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

### Demo Accounts

| Username | Password |
|----------|----------|
| `alice` | `password123` |
| `bob` | `password123` |
| `charlie` | `password123` |
| `diana` | `password123` |
| `eve` | `password123` |

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | Web framework & routing |
| **better-sqlite3** | Embedded SQLite database |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT-based authentication |
| **multer** | File upload handling |

### Frontend
| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure |
| **CSS3** | Styling with custom properties, glassmorphism, animations |
| **Vanilla JS** | Client-side SPA routing, async API calls, DOM rendering |
| **Inter font** | Modern sans-serif typography |
| **CSS Variables** | Theming and design tokens |

---

## 📁 Project Structure

```
Social-Media-Platform/
├── server.js            # Express app entry point
├── db.js                # Database setup & schema
├── seed.js              # Demo data seeder
├── package.json
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── routes/
│   ├── auth.js          # Register & login endpoints
│   ├── users.js         # Profile CRUD & user search
│   ├── posts.js         # Post CRUD & feed queries
│   ├── comments.js      # Comment CRUD
│   ├── likes.js         # Like/unlike posts & comments
│   └── follows.js       # Follow/unfollow & follower lists
├── public/
│   ├── index.html       # SPA shell
│   ├── app.js           # Client-side router & UI renderer
│   └── styles.css       # Complete UI styling
└── social.db            # SQLite database (auto-created)
```

---

## 📡 API Reference

All endpoints return JSON. Authentication uses `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Create a new account |
| `POST` | `/api/auth/login` | No | Login and receive JWT |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/:id` | No | Get user profile |
| `GET` | `/api/users/profile` | Yes | Get current user's profile |
| `PUT` | `/api/users/profile` | Yes | Update profile (bio, avatar) |
| `GET` | `/api/users/search/:query` | Yes | Search users by username |

### Posts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/posts` | Yes | Get all posts |
| `GET` | `/api/posts/feed` | Yes | Get personalized feed (followed users) |
| `GET` | `/api/posts/user/:userId` | Yes | Get posts by a specific user |
| `POST` | `/api/posts` | Yes | Create a new post |
| `DELETE` | `/api/posts/:id` | Yes | Delete own post |

### Comments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/comments/post/:postId` | Yes | Get comments for a post |
| `POST` | `/api/comments` | Yes | Add a comment |
| `DELETE` | `/api/comments/:id` | Yes | Delete own comment |

### Likes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/likes/post/:postId` | Yes | Toggle like on a post |
| `POST` | `/api/likes/comment/:commentId` | Yes | Toggle like on a comment |

### Follows

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/follows/:userId` | Yes | Toggle follow a user |
| `GET` | `/api/follows/status/:userId` | Yes | Check if following a user |
| `GET` | `/api/follows/followers/:userId` | Yes | Get user's followers |
| `GET` | `/api/follows/following/:userId` | Yes | Get users a user follows |

---

## 🎨 Design Highlights

### Color Palette
```css
--accent:   #6c5ce7  /* Primary purple */
--pink:     #fd79a8  /* Like/heart color */
--green:    #00cec9  /* Success */
--orange:   #fdcb6e  /* Warning accent */
--bg-card:  rgba(255, 255, 255, 0.05)  /* Glass base */
```

### UI Effects
- **Glassmorphism**: Backdrop-filter blur on all cards
- **Floating gradients**: Animated background orbs on auth pages
- **Heart animation**: CSS keyframe pulse on like toggle
- **Fade-in transitions**: Smooth page and element entry
- **Responsive**: Mobile-first design with breakpoints

---

## 🧑‍💻 Development

```bash
# Run with nodemon for auto-reload
npx nodemon server.js

# Reset database
rm social.db && node seed.js && npm start
```

---

## 🚢 Deployment

1. Set `JWT_SECRET` environment variable for production
2. Set `PORT` environment variable (default: 3000)
3. Run `node server.js` behind a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name socialsphere
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

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ as part of the <strong>CodeAlpha Full-Stack Internship</strong>
</p>
