# Zoom Clone (Chattique)

A Zoom‑inspired real‑time chat + video calling app built with React, Node.js, Socket.IO, and WebRTC.

---

## Summary
- **Frontend:** Vite + React + TypeScript
- **Backend:** Node.js + Express + Socket.IO
- **Realtime:** Socket.IO for signalling + chat
- **Video/Audio:** WebRTC (P2P mesh)
- **Auth:** Email/password + Google OAuth (token + refresh cookie)

---

## Features (current)
- Auth: register, login, logout, Google OAuth
- Meetings: create/join, participants list
- Chat: real‑time messaging (Socket.IO)
- Video call: P2P WebRTC, screen sharing, mic/video toggles
- Pages: Home, About, Features, Settings, History, Chat/Video

---

## Known TODOs (from code)
Found via `TODO / pending` comments:
- `Backend/Controllers/user.controller.js` – pending section for OTP flow improvements
- `Frontend/src/pages/Chat/ChatArea.tsx` – role‑based offer flow
- `Frontend/src/pages/History.tsx` – title set, add participant images, download button
- `Frontend/src/pages/Setting.tsx` – pending cleanup marker
- `Frontend/src/pages/Video/VideoCall.tsx` – glare handling (perfect negotiation)

---

## Pending tasks you noted (from Notes.md)
High level tasks still open:
- Validate meeting code / verification code
- Refresh token handling for all API calls
- Chat UI spacing/design improvements
- Bug report page
- Clean up file structure, naming conventions, contexts
- Multi‑user video (currently designed for 1:1 / small group)

---

## Flaws / risks / bugs to watch
### Security
- Access token in localStorage → XSS risk
- Socket events may lack strict auth checks
- No rate‑limiting on auth endpoints
- Chat messages not sanitized (XSS risk)

### WebRTC Stability
- ICE candidates can arrive before remote description (buffering needed)
- Offer/answer glare possible → implement perfect negotiation
- P2P mesh does not scale well beyond 3–4 users

### UX / Reliability
- No chat persistence (unless DB message storage added)
- No reconnect/re‑sync for socket reconnects
- Media permission errors not fully handled

---

## What you can add next (recommended)
1. **SFU (mediasoup/Janus)** for >4 participants
2. **Chat history** persistence (last 15 messages)
3. **Bug report page** (simple form + DB)
4. **Device controls** (camera/mic selection)
5. **Recording** (server‑side or client‑side)

---

## How to run (example)
> Update this with your actual commands.
```
Frontend: npm run dev
Backend: npm run dev
```

---