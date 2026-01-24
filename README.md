# Emotify

Emotion analysis based on your Spotify music data.

## Structure

```
emotify/
├── backend/          # Node.js API
└── frontend/         # React frontend
```

## Quick Start

### Backend

```bash
cd backend
npm install
npm start
```

Server: http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:8080

## Setup

1. Create Spotify app at https://developer.spotify.com/dashboard
2. Add redirect URI: `http://localhost:3000/api/auth/callback`
3. Configure `backend/.env`:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```

4. Start MongoDB (optional):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## License

MIT
