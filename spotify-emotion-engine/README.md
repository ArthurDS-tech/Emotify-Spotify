# 🎵 Spotify Emotion Engine - Backend

Análise emocional avançada baseada em dados musicais do Spotify com Machine Learning.

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0
- **Redis** >= 6.0
- **Conta Spotify Developer** (https://developer.spotify.com)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/spotify-emotion-engine.git
cd spotify-emotion-engine
```

### 2. Instale dependências

```bash
npm install
```

### 3. Configure variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o arquivo `.env`:

```env
# Servidor
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Spotify OAuth
SPOTIFY_CLIENT_ID=seu_id_aqui
SPOTIFY_CLIENT_SECRET=seu_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/callback

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=sua_chave_refresh_aqui
REFRESH_TOKEN_EXPIRY=30d

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/emotion-engine

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Crie aplicação no Spotify Developer

1. Acesse https://developer.spotify.com/dashboard
2. Faça login ou crie uma conta
3. Clique em "Create an App"
4. Aceite os termos e crie
5. Copie `Client ID` e `Client Secret` para o `.env`
6. Configure Redirect URIs: `http://localhost:5000/api/auth/callback`

### 5. Inicie os serviços

**MongoDB:**
```bash
# Local
mongod

# Ou com Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Redis:**
```bash
# Local
redis-server

# Ou com Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

### 6. Inicie o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

Servidor rodará em `http://localhost:5000`

## 📚 Endpoints da API

### Autenticação

**GET** `/api/auth/url`
- Retorna URL de autenticação Spotify
- Resposta: `{ authUrl: "https://..." }`

**GET** `/api/auth/callback?code=...`
- Callback do OAuth Spotify
- Retorna: `{ accessToken, refreshToken, user }`

**POST** `/api/auth/refresh`
- Renova token de acesso
- Body: `{ refreshToken }`

### Usuário

**GET** `/api/user/profile`
- Requer: `Authorization: Bearer <token>`
- Retorna perfil do usuário

**PUT** `/api/user/profile`
- Atualiza perfil
- Body: `{ name }`

### Análise Emocional

**GET** `/api/emotion/analyze?period=medium_term`
- Analisa emoções baseado no histórico
- Parâmetros: `period` (short_term|medium_term|long_term)
- Retorna:
```json
{
  "dominantEmotion": "Nostalgia",
  "emotionalBalance": 72,
  "emotionalTimeline": [...],
  "insights": [...],
  "emotionBreakdown": {...},
  "averageAudioFeatures": {...}
}
```

**GET** `/api/emotion/history`
- Histórico de análises
- Retorna: Array de análises anteriores

### Tracks

**GET** `/api/tracks/top?period=medium_term&limit=50`
- Top tracks do usuário
- Retorna: Array de tracks

**GET** `/api/tracks/recently-played?limit=50`
- Músicas tocadas recentemente
- Retorna: Array de tracks

## 🧠 Emotion Engine

### Fórmulas Emocionais

```javascript
alegria = (valence × 0.7) + (energy × 0.3)
melancolia = ((100 - valence) × 0.6) + (acousticness × 0.4)
nostalgia = (acousticness × 0.5) + ((100 - energy) × 0.3) + (|valence - 50| × 0.2)
calma = ((100 - energy) × 0.5) + (acousticness × 0.5)
euforia = (energy × 0.4) + (valence × 0.4) + (danceability × 0.2)
introspecção = (instrumentalness × 0.4) + (acousticness × 0.4) + ((100 - valence) × 0.2)
energia = (energy × 0.6) + (danceability × 0.4)
```

### Audio Features

- **danceability**: 0-1 (quanto é dançável)
- **energy**: 0-1 (intensidade e atividade)
- **acousticness**: 0-1 (uso de instrumentos acústicos)
- **valence**: 0-1 (positividade musical)
- **instrumentalness**: 0-1 (presença de vocais)
- **tempo**: BPM da música

## 🔐 Segurança

- ✅ CORS configurado
- ✅ Rate limiting (100 req/15min)
- ✅ JWT com expiração
- ✅ Senhas com bcrypt
- ✅ Helmet para headers segurança
- ✅ Validação com Joi
- ✅ Tokens Spotify nunca expostos

## 📊 Estrutura do Banco de Dados

### Users
```javascript
{
  spotifyId: String,
  email: String,
  name: String,
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  tokenExpiresAt: Date
}
```

### EmotionAnalysis
```javascript
{
  userId: ObjectId,
  period: String,
  dominantEmotion: String,
  emotionalBalance: Number,
  emotionBreakdown: Object,
  emotionalTimeline: Array,
  insights: Array
}
```

### TrackCache
```javascript
{
  userId: ObjectId,
  spotifyTrackId: String,
  audioFeatures: Object,
  cachedAt: Date (TTL: 30 dias)
}
```

## 🐛 Troubleshooting

**"Token expirado"**
- Use POST `/api/auth/refresh` com refreshToken

**"Muitas requisições"**
- Rate limit: 30 req/min para Spotify
- Aguarde 1 minuto

**"MongoDB não conecta"**
- Verifique URI em .env
- Certifique-se que mongod está rodando

**"Redis não conecta"**
- Cache funciona sem Redis
- Mas análises serão mais lentas

## 📝 Variáveis de Ambiente Completas

Veja `.env.example` para todas as variáveis disponíveis.

## 🚀 Deployment

### Heroku
```bash
heroku login
heroku create seu-app
heroku config:set JWT_SECRET=...
git push heroku main
```

### Docker
```bash
docker build -t emotion-engine .
docker run -p 5000:5000 emotion-engine
```

## 📞 Suporte

Para problemas:
1. Verifique logs em `logs/app.log`
2. Consulte documentação Spotify: https://developer.spotify.com/documentation
3. Abra uma issue no GitHub

## 📄 Licença

MIT