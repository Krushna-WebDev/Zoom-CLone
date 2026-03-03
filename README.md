# Chattique - Real-Time Chat and Video Calling App

A Zoom-inspired real-time chat and video calling application built using React, Node.js, Socket.IO, and WebRTC.

---

## Project Status
Active Development (Work in Progress)

Core functionality is implemented and working.
UI refinements, performance optimizations, and scalability improvements are currently in progress.

---

## Tech Stack
Frontend
- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

Backend
- Node.js
- Express
- Socket.IO
- MongoDB + Mongoose
- Nodemailer
- Zod

Realtime Communication
- Socket.IO (Signaling + Real-time Chat)
- WebRTC (Peer-to-Peer Mesh for Video/Audio)

Authentication
- Email and Password
- Google OAuth
- JWT (Access Token + Refresh Token via HTTP-only cookies)

---

## Current Features
Authentication
- User registration
- User login and logout
- Google OAuth integration
- Secure token-based authentication with refresh flow

Meetings
- Create meeting rooms
- Join meeting rooms
- Live participant list

Chat
- Real-time messaging using Socket.IO
- Room-based communication

Video Calling
- Peer-to-peer WebRTC video and audio calls
- Screen sharing
- Mic toggle
- Camera toggle

Pages Implemented
- Home
- About
- Features
- Settings
- History
- Chat and Video Room

---

## In Progress / Planned Improvements
- UI/UX refinements
- Improved error handling and edge case management
- Performance optimization for multiple participants
- Better meeting history persistence
- Load last messages when joining a room
- Production-ready deployment configuration

---

## Local Development Setup
1. Clone the repository
```bash
git clone <your-repo-url>
cd chattique
```

2. Frontend setup
```bash
cd Frontend
npm install
npm run dev
```

3. Backend setup
```bash
cd Backend
npm install
npm run start
```

---

## Environment Variables
Create the following files with your own values.

Backend `.env`
- PORT
- MONGODB_URI
- JWT_SECRET
- ACCESS_TOKEN_SECRET
- REFRESH_TOKEN_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- EMAIL_USER
- EMAIL_PASSWORD

Frontend `.env`
- VITE_GOOGLE_CLIENT_ID

---

## Notes
- Currently optimized for small group P2P mesh calls (1-4 participants recommended).
- For large-scale production usage, an SFU-based architecture would be required.
- Best tested in modern Chromium-based browsers.
- Do not commit `.env` files. Rotate secrets if they were ever committed.
