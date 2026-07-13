const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, 'social.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER,
    comment_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(follower_id, following_id)
  );
`);

const password = bcrypt.hashSync('password123', 10);

const users = [
  { username: 'alice', email: 'alice@test.com', password, bio: 'Digital artist & photographer 📸' },
  { username: 'bob', email: 'bob@test.com', password, bio: 'Full-stack dev | Coffee addict ☕' },
  { username: 'charlie', email: 'charlie@test.com', password, bio: 'Travel blogger ✈️ | 30 countries' },
  { username: 'diana', email: 'diana@test.com', password, bio: 'Music producer & DJ 🎵' },
  { username: 'eve', email: 'eve@test.com', password, bio: 'Book lover & writer 📚' },
];

const insertUser = db.prepare('INSERT INTO users (username, email, password, bio) VALUES (?, ?, ?, ?)');

const userIds = [];
for (const u of users) {
  const result = insertUser.run(u.username, u.email, u.password, u.bio);
  userIds.push(result.lastInsertRowid);
}

const posts = [
  { user_id: userIds[0], content: 'Just finished editing a new photo series. Sunset vibes from the coast. Can\'t wait to share the full collection! 🌅📷' },
  { user_id: userIds[1], content: 'Deployed my new side project today! Built with React + Node. Still figuring out some edge cases but proud of the progress. 🚀' },
  { user_id: userIds[2], content: 'Just landed in Tokyo! The energy here is incredible. First stop: Shibuya crossing and some ramen 🍜🗾' },
  { user_id: userIds[3], content: 'New track dropped on SoundCloud! Spent 3 months on this one. Link in bio, would love to hear what you think 🎧🔥' },
  { user_id: userIds[4], content: 'Just finished reading "Project Hail Mary" by Andy Weir. Absolutely phenomenal. If you love sci-fi, do yourself a favor and read it! 📖✨' },
  { user_id: userIds[0], content: 'Morning light through the window. Simple moments are often the most beautiful. Who else appreciates the quiet mornings? ☀️' },
  { user_id: userIds[1], content: 'Hot take: TypeScript is the best thing that happened to JavaScript. Fight me. 😤💻' },
  { user_id: userIds[2], content: 'Street food tour in Bangkok was unreal! Pad Thai from a street vendor hits different. 🇹🇭✨' },
  { user_id: userIds[3], content: 'Studio session tonight. Working on something experimental with analog synths. The warmth of analog sound is unmatched 🎹' },
  { user_id: userIds[4], content: 'Currently reading: "The Midnight Library" by Matt Haig. Halfway through and it\'s already changing my perspective on life. 🌟' },
  { user_id: userIds[1], content: 'Pro tip: Always use a linter. ESLint + Prettier combo saves hours of debugging. Your future self will thank you. ⚡' },
  { user_id: userIds[0], content: 'New camera day! Just got the Sony A7IV. Time to take my photography to the next level. Any lens recommendations? 📸🤔' },
];

const insertPost = db.prepare('INSERT INTO posts (user_id, content) VALUES (?, ?)');
const postIds = [];
for (const p of posts) {
  const result = insertPost.run(p.user_id, p.content);
  postIds.push(result.lastInsertRowid);
}

const comments = [
  { post_id: postIds[0], user_id: userIds[1], content: 'These look amazing! Your editing skills are top-notch 🔥' },
  { post_id: postIds[0], user_id: userIds[2], content: 'Would love to visit that coast! Where is this?' },
  { post_id: postIds[1], user_id: userIds[0], content: 'Congrats! Would love to check it out. What tech stack did you use?' },
  { post_id: postIds[1], user_id: userIds[3], content: 'Self-hosting or cloud? Either way, shipping is a win! 🚀' },
  { post_id: postIds[2], user_id: userIds[4], content: 'Tokyo is on my bucket list! Have an amazing trip!' },
  { post_id: postIds[2], user_id: userIds[0], content: 'Try the sushi at Tsukiji market! You won\'t regret it 🍣' },
  { post_id: postIds[3], user_id: userIds[1], content: 'Just listened to it. The drop at 2:30 is insane! 🔥🎵' },
  { post_id: postIds[3], user_id: userIds[4], content: 'Love the new direction! Giving me Daft Punk vibes' },
  { post_id: postIds[4], user_id: userIds[2], content: 'Adding this to my reading list! Thanks for the recommendation 📚' },
  { post_id: postIds[4], user_id: userIds[3], content: 'Andy Weir is a genius. Have you read "The Martian"?' },
  { post_id: postIds[5], user_id: userIds[3], content: 'This is so peaceful. Mornings are truly underrated ☀️' },
  { post_id: postIds[6], user_id: userIds[0], content: 'As a TS lover, I can\'t disagree 🙌' },
  { post_id: postIds[6], user_id: userIds[2], content: 'Until you have to debug complex generics... still worth it though' },
  { post_id: postIds[7], user_id: userIds[1], content: 'Bangkok street food is unmatched! Miss that place' },
  { post_id: postIds[8], user_id: userIds[0], content: 'Analog synths sound so warm! Would love to hear the results' },
];

const insertComment = db.prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)');
for (const c of comments) {
  insertComment.run(c.post_id, c.user_id, c.content);
}

const likePairs = [
  [1, 1], [1, 2], [1, 3],
  [2, 2], [2, 4], [2, 5],
  [3, 1], [3, 4], [3, 5],
  [4, 1], [4, 2], [4, 5],
  [5, 2], [5, 3],
  [6, 3], [6, 4],
  [7, 1], [7, 3], [7, 5],
  [8, 1], [8, 2],
  [9, 4], [9, 5],
  [10, 1], [10, 3],
  [11, 2], [11, 4],
  [12, 1], [12, 2], [12, 5],
];

const insertLike = db.prepare('INSERT OR IGNORE INTO likes (user_id, post_id) VALUES (?, ?)');
for (const [userIdx, postIdx] of likePairs) {
  insertLike.run(userIds[userIdx - 1], postIds[postIdx - 1]);
}

const followPairs = [
  [1, 2], [1, 3], [1, 4],
  [2, 1], [2, 3], [2, 5],
  [3, 1], [3, 4], [3, 5],
  [4, 1], [4, 2], [4, 5],
  [5, 2], [5, 3], [5, 4],
];

const insertFollow = db.prepare('INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)');
for (const [followerIdx, followingIdx] of followPairs) {
  insertFollow.run(userIds[followerIdx - 1], userIds[followingIdx - 1]);
}

console.log('Seed data inserted:');
console.log(`  - ${users.length} users`);
console.log(`  - ${posts.length} posts`);
console.log(`  - ${comments.length} comments`);
console.log(`  - ${likePairs.length} likes`);
console.log(`  - ${followPairs.length} follows`);
console.log('\nLogin credentials for all users: username = any [alice, bob, charlie, diana, eve], password = password123');

db.close();
