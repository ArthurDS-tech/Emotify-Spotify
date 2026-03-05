# 📡 API Documentation - Emotify

Base URL: `http://localhost:3001/api`

## 🔐 Autenticação

Todas as rotas (exceto `/auth/login` e `/auth/callback`) requerem autenticação via JWT.

**Header:**
```
Authorization: Bearer <seu_token_jwt>
```

---

## 🎫 Auth Routes

### GET /auth/login
Retorna a URL de autenticação do Spotify.

**Response:**
```json
{
  "authUrl": "https://accounts.spotify.com/authorize?..."
}
```

### GET /auth/callback
Callback do OAuth do Spotify (não chamar diretamente).

**Query Params:**
- `code`: Authorization code do Spotify

**Redirect:** `${FRONTEND_URL}/auth/success?token=<jwt_token>`

### GET /auth/me
Retorna informações do usuário atual.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "spotify_id": "string",
    "email": "user@example.com",
    "display_name": "User Name",
    "profile_image": "https://...",
    "country": "BR",
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-01T00:00:00Z"
  }
}
```

### POST /auth/refresh
Atualiza o token de acesso do Spotify.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

### POST /auth/logout
Faz logout do usuário.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🎭 Emotion Routes

### GET /emotion/analyze/top-tracks
Analisa as top tracks do usuário e retorna análise emocional.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `timeRange` (optional): `short_term`, `medium_term`, `long_term` (default: `medium_term`)
- `limit` (optional): 1-50 (default: 50)

**Response:**
```json
{
  "analyses": [
    {
      "track": {
        "id": "track_id",
        "name": "Track Name",
        "artists": "Artist Name",
        "album": "Album Name",
        "albumImage": "https://...",
        "duration": 180000
      },
      "audioFeatures": {
        "valence": 0.8,
        "energy": 0.7,
        "danceability": 0.6,
        ...
      },
      "analysis": {
        "emotions": {
          "joy": 0.85,
          "sadness": 0.15,
          "energy": 0.75,
          "calm": 0.25,
          "nostalgia": 0.30,
          "euphoria": 0.70,
          "introspection": 0.20
        },
        "primaryEmotion": "joy",
        "emotionIntensity": 0.85
      }
    }
  ],
  "aggregated": {
    "averageEmotions": {
      "joy": 0.65,
      "sadness": 0.25,
      ...
    },
    "dominantEmotion": "joy",
    "dominantEmotionPercentage": 45.5,
    "emotionDistribution": {
      "joy": 23,
      "sadness": 12,
      ...
    },
    "totalTracks": 50
  }
}
```

### GET /emotion/analyze/track/:trackId
Analisa uma música específica.

**Headers:** `Authorization: Bearer <token>`

**Params:**
- `trackId`: ID da track no Spotify

**Response:**
```json
{
  "track": { ... },
  "analysis": {
    "emotions": { ... },
    "primaryEmotion": "joy",
    "emotionIntensity": 0.85
  },
  "cached": false
}
```

### GET /emotion/analyses
Retorna análises salvas do usuário.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `limit` (optional): 1-100 (default: 50)

**Response:**
```json
{
  "analyses": [
    {
      "id": "uuid",
      "track_id": "spotify_track_id",
      "track_name": "Track Name",
      "artist_name": "Artist Name",
      "primary_emotion": "joy",
      "emotion_intensity": 0.85,
      "joy_score": 0.85,
      "sadness_score": 0.15,
      ...
    }
  ]
}
```

### GET /emotion/distribution
Retorna distribuição emocional do usuário.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "distribution": {
    "joy": 23,
    "sadness": 12,
    "energy": 18,
    ...
  },
  "averageScores": {
    "joy": 0.65,
    "sadness": 0.25,
    ...
  },
  "dominantEmotion": "joy",
  "dominantPercentage": 45.5,
  "totalTracks": 50
}
```

### GET /emotion/insights
Retorna insights personalizados do usuário.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "insights": {
    "top_emotion": "joy",
    "top_emotion_percentage": 45.5,
    "avg_valence": 0.65,
    "avg_energy": 0.70,
    "total_tracks_analyzed": 50,
    ...
  },
  "personalizedInsights": [
    {
      "type": "dominant_emotion",
      "title": "Sua vibe é joy",
      "description": "45.5% das suas músicas são alegres e positivas",
      "icon": "😊"
    }
  ]
}
```

---

## 🎵 Tracks Routes

### GET /tracks/top
Retorna top tracks do usuário.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `timeRange` (optional): `short_term`, `medium_term`, `long_term`
- `limit` (optional): 1-50

**Response:**
```json
{
  "tracks": [
    {
      "id": "track_id",
      "name": "Track Name",
      "artists": [...],
      "album": {...},
      "duration_ms": 180000,
      "popularity": 85
    }
  ]
}
```

### GET /tracks/recent
Retorna músicas tocadas recentemente.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `limit` (optional): 1-50

**Response:**
```json
{
  "tracks": [
    {
      "track": {...},
      "played_at": "2024-01-01T12:00:00Z",
      "context": {...}
    }
  ]
}
```

### GET /tracks/search
Busca músicas no Spotify.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `q` (required): Query de busca
- `limit` (optional): 1-50

**Response:**
```json
{
  "tracks": [...]
}
```

### GET /tracks/:trackId
Retorna detalhes de uma música.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "track": {...}
}
```

### GET /tracks/:trackId/features
Retorna audio features de uma música.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "features": {
    "valence": 0.8,
    "energy": 0.7,
    "danceability": 0.6,
    "acousticness": 0.3,
    "instrumentalness": 0.1,
    "speechiness": 0.05,
    "liveness": 0.2,
    "tempo": 120.5,
    "loudness": -5.2,
    "mode": 1,
    "key": 5,
    "duration_ms": 180000,
    "time_signature": 4
  }
}
```

---

## 🎼 Playlist Routes

### GET /playlists
Retorna playlists do usuário.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "playlists": [...]
}
```

### POST /playlists/create-emotion
Cria playlist baseada em emoção.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "emotion": "joy",
  "name": "Músicas Alegres",
  "description": "Playlist de músicas alegres",
  "trackCount": 20
}
```

**Response:**
```json
{
  "playlist": {
    "id": "playlist_id",
    "name": "Músicas Alegres",
    "external_urls": {...}
  },
  "trackCount": 20
}
```

### GET /playlists/recommendations
Retorna recomendações baseadas em emoção.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `emotion` (optional): Emoção específica
- `limit` (optional): 1-100

**Response:**
```json
{
  "recommendations": [...]
}
```

---

## 👤 User Routes

### GET /user/profile
Retorna perfil completo do usuário.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {...},
  "insights": {...}
}
```

### GET /user/history
Retorna histórico de reprodução.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `limit` (optional): 1-100

**Response:**
```json
{
  "history": [
    {
      "track_id": "...",
      "track_name": "...",
      "played_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### GET /user/compatible
Busca usuários compatíveis (feature em desenvolvimento).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "compatibleUsers": [],
  "message": "Feature coming soon"
}
```

### GET /user/connections
Retorna conexões do usuário.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `status` (optional): `pending`, `accepted`, `blocked`

**Response:**
```json
{
  "connections": [...]
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📊 Rate Limiting

- 100 requisições por 15 minutos por IP
- Headers de rate limit incluídos nas respostas:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## 🔄 Fluxo de Autenticação

1. Frontend chama `GET /auth/login`
2. Redireciona usuário para URL do Spotify
3. Usuário autoriza no Spotify
4. Spotify redireciona para `/auth/callback?code=...`
5. Backend troca code por tokens
6. Backend cria/atualiza usuário no Supabase
7. Backend gera JWT
8. Redireciona para frontend com JWT
9. Frontend salva JWT no localStorage
10. Frontend usa JWT em todas as requisições

---

## 🎯 Exemplos de Uso

### JavaScript/TypeScript
```typescript
const API_URL = 'http://localhost:3001/api';
const token = localStorage.getItem('token');

// Analisar top tracks
const response = await fetch(`${API_URL}/emotion/analyze/top-tracks`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

### cURL
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/emotion/distribution
```

### Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const { data } = await api.get('/emotion/insights');
```
