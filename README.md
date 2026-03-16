# Chattique

Chattique is a real-time meeting and chat app inspired by Zoom-style rooms. It lets users create or join a room, chat live with participants, and switch into a WebRTC video call inside the same meeting flow.

The project currently supports room chat, authentication, participant tracking, and small-group video calling with screen share and media controls.

## Current Status

This project is still in active development.

What is working now:
- user signup and login
- Google sign-in
- JWT auth with refresh flow
- create and join meeting rooms
- real-time group chat with Socket.IO
- participant list in the room
- WebRTC video call for up to 3 total users
- mute, camera toggle, and screen sharing

What is still improving:
- video-call stability and performance
- chat and meeting UI polish
- better handling for reconnect/rejoin edge cases
- testing and production hardening

## Tech Stack

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- JWT
- Nodemailer
- Zod

Realtime:
- Socket.IO for room events and chat
- WebRTC mesh for peer-to-peer video/audio

## Main Features

### Authentication
- signup with email/password
- login and logout
- Google authentication
- refresh token based auth flow

### Meeting Rooms
- create a meeting room
- join an existing room using meeting id
- live participant updates
- room-based chat and video flow

### Chat
- instant messaging inside a room
- join and leave activity messages
- recent messages fetched from backend

### Video Call
- video/audio call inside the room
- max 3 users in one video room
- screen sharing
- mute / unmute
- camera on / off
- leave room from video view

## Project Structure

```text
Zoom Clone/
├── Backend/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Model/
│   ├── Routes/
│   ├── config/
│   └── app.js
├── Frontend/
│   ├── Context/
│   ├── public/
│   └── src/
│       └── pages/
│           ├── Chat/
│           └── Video/
└── README.md
```

## Routes

Current frontend routes:
- `/`
- `/signup`
- `/history`
- `/settings`
- `/about`
- `/features`
- `/bug-report`
- `/notfound`
- `/chatarea/:meetingId`

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Krushna-WebDev/Zoom-CLone.git
cd "Zoom Clone"
```

### 2. Install frontend dependencies

```bash
cd Frontend
npm install
npm run dev
```

### 3. Install backend dependencies

Open a second terminal:

```bash
cd Backend
npm install
npm run start
```

Frontend runs on:
- `http://localhost:5173`

Backend runs on:
- `http://localhost:5000`

## Environment Variables

### Backend `.env`

Set these values in `Backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_app_password
```

### Frontend `.env`

Set this value in `Frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Scripts

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
npm run start
```

## Notes

- Video calling currently uses a mesh architecture, so each user connects directly with the others.
- Because of that, performance can drop as participant count increases.
- The room video limit is currently set to 3 total users to keep the experience more stable.

## Future Improvements

- stronger reconnect and call recovery
- better responsive layouts for chat and video
- meeting moderation controls
- call quality optimization
- proper loading, error, and empty states across the app
- deployment configuration
