# 📺 YouTube Backend API

A robust, production-ready RESTful API for a YouTube-style video platform. Built with **Node.js**, **Express.js**, and **MongoDB**, featuring JWT authentication, Cloudinary media management, and comprehensive endpoints for videos, user engagement, and analytics.

🔗 **Live API:** [youtube-backend-api-ivory.vercel.app](https://youtube-backend-api-ivory.vercel.app)  
📦 **GitHub:** [jayy-codes07/youtube-backend-api](https://github.com/jayy-codes07/youtube-backend-api)

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (Access + Refresh Tokens) |
| Media Storage | Cloudinary + Multer |
| Deployment | Vercel |

---

## ✨ Features

- Secure user authentication with JWT access and refresh token rotation
- Video upload, publishing, and management via Cloudinary
- Like system for videos, comments, and tweets
- Comment threads per video
- Twitter-style tweet system
- Channel subscriptions and subscriber tracking
- Custom video playlists
- Watch history tracking
- Creator dashboard with channel analytics

---

## 📁 Project Structure

```
src/
├── controllers/     # Route handler logic
├── db/              # MongoDB connection
├── middlewares/     # Auth (verifyJWT), multer upload
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── utils/           # ApiError, ApiResponse, asyncHandler, cloudinary
├── app.js           # Express app setup
└── index.js         # Server entry point
```

---

## 🛣️ API Routes

Base URL: `https://youtube-backend-api-ivory.vercel.app`

> 🔒 = Protected route (requires `Authorization: Bearer <token>` header)

---

### 🏥 Healthcheck

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/healthcheck` | Check if API is running |

---

### 👤 Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register with avatar + cover image upload |
| POST | `/login` | Public | Login and receive tokens |
| POST | `/logout` | 🔒 | Logout current user |
| POST | `/refresh-token` | Public | Refresh access token |
| POST | `/change-password` | 🔒 | Change current password |
| GET | `/current-user` | 🔒 | Get logged-in user details |
| PATCH | `/update-profile` | 🔒 | Update name, email, etc. |
| PATCH | `/avatar` | 🔒 | Update avatar image |
| PATCH | `/coverImage` | 🔒 | Update cover image |
| GET | `/channel/:username` | 🔒 | Get public channel profile |
| GET | `/history` | 🔒 | Get watch history |

---

### 🎬 Videos — `/api/v1/videos`

> All routes are protected 🔒

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all videos (with filters) |
| POST | `/` | Upload and publish a video |
| GET | `/:videoId` | Get a video by ID |
| PATCH | `/:videoId` | Update video details / thumbnail |
| DELETE | `/:videoId` | Delete a video |
| PATCH | `/toggle/publish/:videoId` | Toggle video publish status |

---

### 💬 Comments — `/api/v1/comments`

> All routes are protected 🔒

| Method | Endpoint | Description |
|---|---|---|
| GET | `/:videoId` | Get all comments for a video |
| POST | `/:videoId` | Add a comment to a video |
| PATCH | `/c/:commentId` | Update a comment |
| DELETE | `/c/:commentId` | Delete a comment |

---

### 🐦 Tweets — `/api/v1/tweets`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | 🔒 | Create a tweet |
| GET | `/user/:userId` | Public | Get all tweets by a user |
| PATCH | `/:tweetId` | 🔒 | Update a tweet |
| DELETE | `/:tweetId` | 🔒 | Delete a tweet |

---

### ❤️ Likes — `/api/v1/likes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/toggle/v/:videoId` | 🔒 | Toggle like on a video |
| POST | `/toggle/c/:commentId` | 🔒 | Toggle like on a comment |
| POST | `/toggle/t/:tweetId` | 🔒 | Toggle like on a tweet |
| GET | `/videos` | 🔒 | Get all videos liked by user |

---

### 📋 Playlists — `/api/v1/playlists`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/user/:userId` | Public | Get all playlists by a user |
| PATCH | `/add/:videoId/:playlistId` | 🔒 | Add a video to a playlist |
| PATCH | `/remove/:videoId/:playlistId` | 🔒 | Remove a video from a playlist |

---

### 🔔 Subscriptions — `/api/v1/subscriptions`

> All routes are protected 🔒

| Method | Endpoint | Description |
|---|---|---|
| GET | `/c/:channelId` | Get subscribers of a channel |
| POST | `/c/:channelId` | Toggle subscription to a channel |
| GET | `/u/:subscriberId` | Get channels a user is subscribed to |

---

### 📊 Dashboard — `/api/v1/dashboard`

> All routes are protected 🔒

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Get channel stats (views, subscribers, videos, likes) |
| GET | `/videos` | Get all videos for the logged-in channel |

---

## 🔐 Authentication

This API uses a dual-token strategy:

- **Access Token** — short-lived, sent with every protected request
- **Refresh Token** — long-lived, stored in HTTP-only cookie, used to generate new access tokens

Include the access token in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

```bash
# Clone the repo
git clone https://github.com/jayy-codes07/youtube-backend-api.git
cd youtube-backend-api

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
npm run dev
```

API will be available at `http://localhost:8000`

---

## 📬 Sample Response Format

All responses follow a consistent structure:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

---

## 👨‍💻 Author

**Hadiya Jay**  
[GitHub](https://github.com/jayy-codes07) · [Email](mailto:hadiyajay2010@gmail.com)
