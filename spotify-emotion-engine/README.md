# 🎵 Spotify Emotion Engine

Análise emocional baseada em dados musicais do Spotify com Machine Learning.

## O que é?

Um backend que analisa suas emoções através dos dados das suas músicas do Spotify. A gente pega as características de áudio das suas faixas (energia, valência, acústica) e identifica os sentimentos dominantes na sua playlist.

## Pré-requisitos

- Node.js v18+
- MongoDB v5+
- Redis v6+
- Conta Spotify Developer

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/spotify-emotion-engine.git
cd spotify-emotion-engine
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o arquivo `.env`:

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

SPOTIFY_CLIENT_ID=seu_id
SPOTIFY_CLIENT_SECRET=seu_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/callback

JWT_SECRET=sua_chave_secreta
JWT_EXPIRY=7d

REDIS_HOST=localhost
REDIS_PORT=6379
MONGODB_URI=mongodb://localhost:27017/emotion-engine
```

### 4. Crie uma aplicação no Spotify Developer

1. Acesse https://developer.spotify.com/dashboard
2. Faça login ou crie uma conta
3. Clique em "Create an App"
4. Copie o Client ID e Client Secret para seu `.env`
5. Configure o Redirect URI: `http://localhost:5000/api/auth/callback`

### 5. Inicie MongoDB e Redis

```bash
# MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Redis
docker run -d -p 6379:6379 --name redis redis:latest
```

### 6. Inicie o servidor

```bash
npm run dev
```

O servidor rodará em `http://localhost:5000`

## API Endpoints

### Autenticação

```
GET /api/auth/url
Retorna a URL para autenticar no Spotify

GET /api/auth/callback?code=...
Callback do OAuth Spotify

POST /api/auth/refresh
Renova seu token de acesso
Body: { refreshToken }
```

### Usuário

```
GET /api/user/profile
Headers: Authorization: Bearer <token>
Retorna seu perfil do Spotify

PUT /api/user/profile
Body: { name }
Atualiza seu perfil
```

### Análise Emocional

```
GET /api/emotion/analyze?period=medium_term
Period: short_term | medium_term | long_term

Resposta:
{
  "dominantEmotion": "Nostalgia",
  "emotionalBalance": 72,
  "emotionBreakdown": {
    "alegria": 65,
    "melancolia": 45,
    "nostalgia": 88,
    "calma": 52,
    "euforia": 71,
    "energia": 78
  },
  "insights": [...]
}
```

### Tracks

```
GET /api/tracks/top?period=medium_term&limit=50
Suas músicas favoritas

GET /api/tracks/recently-played?limit=50
Músicas tocadas recentemente

GET /api/emotion/history
Histórico de análises
```

## Como funciona

O engine analisa 7 emoções principais baseado nas características de áudio:

- **Alegria**: Músicas positivas e enérgicas
- **Melancolia**: Tom mais triste, menos energia
- **Nostalgia**: Acústico, calmo e reflexivo
- **Calma**: Relaxante, sem muita energia
- **Euforia**: Dançável, animado, festivo
- **Introspecção**: Instrumental, reflexivo
- **Energia**: Intensidade e ritmo forte

## Segurança

- JWT com expiração automática
- Senhas com bcrypt
- CORS configurado
- Rate limiting
- Validação de entrada
- Tokens Spotify criptografados

## Problemas comuns

**Token expirado**
```
Use POST /api/auth/refresh com seu refreshToken
```

**MongoDB não conecta**
```
Verifique: docker ps | grep mongodb
Reinicie: docker restart mongodb
```

**Muitas requisições**
```
Spotify limita a 30 req/min
Aguarde um tempo antes de continuar
```

**Redis não conecta**
```
Cache funciona sem Redis (mais lento)
Reinicie: docker restart redis
```

## Deploy

### Docker

```bash
docker build -t emotion-engine .
docker run -p 5000:5000 emotion-engine
```

### Heroku

```bash
heroku login
heroku create seu-app
heroku config:set JWT_SECRET=...
git push heroku main
```

## Estrutura do Banco

**Users**
```
{
  spotifyId: String,
  email: String,
  name: String,
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  tokenExpiresAt: Date
}
```

**EmotionAnalysis**
```
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

## Licença

MIT
